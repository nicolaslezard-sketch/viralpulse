"use client";

import { useMemo, useState } from "react";
import type { UserPlan } from "@/lib/useUserPlan";
import { limitsByPlan } from "@/lib/limits";
import { MONTHLY_MINUTES_BY_PLAN } from "@/lib/planLimits";

export type LimitReason =
  | {
      kind: "audio_too_long";
      plan: UserPlan;
      durationSec?: number;
    }
  | {
      kind: "monthly_limit_reached";
      plan: UserPlan;
      remainingMinutes?: number;
    }
  | {
      kind: "daily_limit_reached";
      plan: UserPlan;
    }
  | {
      kind: "unknown";
      plan: UserPlan;
      message?: string;
    };

function planLabel(plan: UserPlan) {
  if (plan === "pro") return "Pro";
  if (plan === "plus") return "Creator";
  return "Free";
}

function suggestedPlan(reason: LimitReason): "plus" | "pro" {
  if (reason.kind === "audio_too_long") {
    const sec = reason.durationSec ?? 0;
    if (sec > limitsByPlan.plus.maxSeconds) return "pro";
    return "plus";
  }

  if (reason.plan === "plus") return "pro";

  return "plus";
}

function checkoutLabel(plan: "plus" | "pro") {
  return plan === "pro" ? "Upgrade to Pro" : "Upgrade to Creator";
}

async function safeErrorMessage(res: Response) {
  try {
    const data = (await res.json()) as { error?: string; message?: string };
    return data?.error || data?.message;
  } catch {
    try {
      return await res.text();
    } catch {
      return null;
    }
  }
}

export default function LimitReachedPanel({
  reason,
  onDismiss,
}: {
  reason: LimitReason;
  onDismiss: () => void;
}) {
  const suggestion = useMemo(() => suggestedPlan(reason), [reason]);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const title = "This upload needs a higher limit";

  const body = useMemo(() => {
    if (reason.kind === "audio_too_long") {
      const maxMin = Math.round(limitsByPlan[reason.plan].maxSeconds / 60);
      const suggestedMaxMin = Math.round(
        limitsByPlan[suggestion].maxSeconds / 60,
      );
      const durMin =
        typeof reason.durationSec === "number"
          ? Math.max(1, Math.ceil(reason.durationSec / 60))
          : null;

      if (durMin) {
        return `Your ${planLabel(
          reason.plan,
        )} plan supports files up to ${maxMin} minutes. This file is ~${durMin} minutes. ${planLabel(
          suggestion,
        )} supports up to ${suggestedMaxMin} minutes per file.`;
      }

      return `Your ${planLabel(
        reason.plan,
      )} plan supports files up to ${maxMin} minutes. ${planLabel(
        suggestion,
      )} supports longer uploads.`;
    }

    if (reason.kind === "monthly_limit_reached") {
      return `You’ve used your monthly minutes for this plan. ${planLabel(
        suggestion,
      )} gives you higher monthly limits and full reports.`;
    }

    if (reason.kind === "daily_limit_reached") {
      return "You’ve reached today’s free analysis limit. Creator unlocks higher usage and full reports.";
    }

    return reason.message ?? "This analysis is blocked by your current limits.";
  }, [reason, suggestion]);

  async function openCheckout() {
    if (loading) return;

    setLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/lemon/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: suggestion }),
      });

      if (!res.ok) {
        const msg = await safeErrorMessage(res);
        throw new Error(msg || "Checkout failed");
      }

      const data = (await res.json()) as { url?: string };

      if (!data.url) {
        throw new Error("Missing checkout URL");
      }

      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div
      className="
        mt-4 rounded-2xl p-4 sm:p-5
        bg-white/5 backdrop-blur
        border border-indigo-400/20
        shadow-[0_0_0_1px_rgba(99,102,241,0.08)]
      "
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-bold text-white">{title}</div>

          <div className="mt-2 text-sm leading-relaxed text-white/70">
            {body}
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-relaxed text-zinc-300">
            <span className="font-semibold text-indigo-200">
              {planLabel(suggestion)}
            </span>{" "}
            also unlocks full reports, full AI rewrites, transcript access and
            analysis history.
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#pricing"
              className="
                inline-flex w-full items-center justify-center rounded-xl
                bg-white px-4 py-2.5 text-sm font-semibold text-black
                transition hover:bg-white/90 sm:w-auto
              "
            >
              See plans
            </a>

            <button
              type="button"
              onClick={openCheckout}
              disabled={loading}
              className="
                inline-flex w-full items-center justify-center rounded-xl
                border border-indigo-400/30 bg-indigo-500/20 px-4 py-2.5
                text-sm font-semibold text-indigo-100 transition
                hover:bg-indigo-500/30 hover:text-white disabled:cursor-not-allowed
                disabled:opacity-60 sm:w-auto
              "
            >
              {loading ? "Opening checkout…" : checkoutLabel(suggestion)}
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="
                inline-flex w-full items-center justify-center rounded-xl
                border border-white/10 bg-white/0 px-4 py-2.5
                text-sm font-semibold text-white/60 transition
                hover:bg-white/5 hover:text-white/80 sm:w-auto
              "
            >
              Dismiss
            </button>
          </div>

          {checkoutError ? (
            <p className="mt-2 text-xs text-red-300">{checkoutError}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white/80"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
