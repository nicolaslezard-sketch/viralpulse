"use client";

import { useMemo } from "react";
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
  if (plan === "plus") return "Plus";
  return "Free";
}

function suggestedPlan(reason: LimitReason): "plus" | "pro" {
  // If audio is too long for Plus, suggest Pro.
  if (reason.kind === "audio_too_long") {
    const sec = reason.durationSec ?? 0;
    if (sec > limitsByPlan.plus.maxSeconds) return "pro";
    return "plus";
  }

  // If user is Plus and ran out of minutes, Pro fixes it.
  if (reason.plan === "plus") return "pro";

  // Default: Plus is the next step for Free users.
  return "plus";
}

function anchorForPlan(p: "plus" | "pro") {
  return p === "pro" ? "#plan-pro" : "#plan-plus";
}

export default function LimitReachedPanel({
  reason,
  onDismiss,
}: {
  reason: LimitReason;
  onDismiss: () => void;
}) {
  const suggestion = useMemo(() => suggestedPlan(reason), [reason]);
  const title = "This upload can’t be analyzed on your current plan";

  const body = useMemo(() => {
    if (reason.kind === "audio_too_long") {
      const maxMin = Math.round(limitsByPlan[reason.plan].maxSeconds / 60);
      const durMin =
        typeof reason.durationSec === "number"
          ? Math.max(1, Math.ceil(reason.durationSec / 60))
          : null;

      if (durMin) {
        return `Your plan allows up to ${maxMin} minutes per audio. This file is ~${durMin} minutes.`;
      }
      return `Your plan allows up to ${maxMin} minutes per audio.`;
    }

    if (reason.kind === "monthly_limit_reached") {
      const limit =
        reason.plan === "free"
          ? MONTHLY_MINUTES_BY_PLAN.free
          : MONTHLY_MINUTES_BY_PLAN[reason.plan];
      const remaining =
        typeof reason.remainingMinutes === "number" ? reason.remainingMinutes : 0;

      return `You’ve used your monthly minutes for this plan (${limit - remaining} / ${limit}).`;
    }

    if (reason.kind === "daily_limit_reached") {
      return "You’ve reached today’s free analysis limit.";
    }

    return reason.message ?? "This analysis is blocked by your current limits.";
  }, [reason]);

  return (
    <div
      className="
        mt-4 rounded-2xl p-4
        bg-white/5 backdrop-blur
        border border-white/10
        shadow-[0_0_0_1px_rgba(255,255,255,0.04)]
      "
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="mt-1 text-sm text-white/70">{body}</div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href="#pricing"
              className="
                inline-flex items-center justify-center
                rounded-xl px-4 py-2 text-sm font-medium
                bg-white text-black
                hover:bg-white/90 transition
              "
            >
              See plans
            </a>

            <a
              href={anchorForPlan(suggestion)}
              className="
                rounded-xl px-4 py-2 text-sm font-medium
                bg-white/0 text-white/80
                border border-white/10
                hover:bg-white/5 hover:text-white/90 transition
              "
            >
              Go to {planLabel(suggestion)}
            </a>

            <button
              type="button"
              onClick={onDismiss}
              className="
                rounded-xl px-4 py-2 text-sm font-medium
                bg-white/0 text-white/60
                border border-white/10
                hover:bg-white/5 hover:text-white/80 transition
              "
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-2 text-white/50 hover:text-white/80 hover:bg-white/5 transition"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
