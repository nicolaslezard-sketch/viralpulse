"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";
import ResultsView from "@/components/ResultsView";
import { useUserPlan } from "@/lib/useUserPlan";
import type { FullReport } from "@/lib/report/types";
import Link from "next/link";

type ReportStatus =
  | "queued"
  | "extracting_audio"
  | "transcribing"
  | "analyzing"
  | "done"
  | "error"
  | string;

type ReportResponse = {
  id: string;
  status: ReportStatus;
  report: FullReport | null;
  viralScore?: number | null;
  transcript: string | null;
  transcriptPreview: string | null;
  isPaid: boolean;
  canSeeFull: boolean;
  freeFullPreview: boolean;
  oneShotUnlocked: boolean;
};

const POLLABLE_STATUSES = new Set<ReportStatus>([
  "queued",
  "extracting_audio",
  "transcribing",
  "analyzing",
]);

function getStatusCopy(status: ReportStatus) {
  switch (status) {
    case "queued":
      return {
        eyebrow: "Queued",
        title: "Your report is in queue",
        description: "We received your media and queued it for processing.",
      };
    case "extracting_audio":
      return {
        eyebrow: "Preparing media",
        title: "Extracting audio from your file",
        description: "We’re preparing the source so transcription can begin.",
      };
    case "transcribing":
      return {
        eyebrow: "Transcribing",
        title: "Turning speech into text",
        description:
          "We’re generating the transcript before running the AI analysis.",
      };
    case "analyzing":
      return {
        eyebrow: "Analyzing",
        title: "Building your viral report",
        description:
          "We’re generating insights, score, strategy ideas and rewrite.",
      };
    case "error":
      return {
        eyebrow: "Error",
        title: "This analysis could not be completed",
        description:
          "Please go back and try again with a clearer file, enough speech, and at least the minimum supported duration.",
      };
    default:
      return {
        eyebrow: "Processing",
        title: "Your report is still processing",
        description:
          "Refresh in a moment. We’ll show the full report as soon as it is ready.",
      };
  }
}

function ProcessingState({ status }: { status: ReportStatus }) {
  const copy = getStatusCopy(status);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/80">
          {copy.eyebrow}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
          {copy.description}
        </p>

        {status !== "error" && (
          <div className="mt-8 space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-400" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {["queued", "extracting_audio", "transcribing", "analyzing"].map(
                (item) => (
                  <div
                    key={item}
                    className={`rounded-2xl border p-4 text-sm ${
                      status === item
                        ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
                        : "border-white/10 bg-white/5 text-zinc-400"
                    }`}
                  >
                    {item === "queued"
                      ? "Queued"
                      : item === "extracting_audio"
                        ? "Extracting audio"
                        : item === "transcribing"
                          ? "Transcribing"
                          : "Analyzing"}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/history"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to history
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Analyze another file
          </Link>
        </div>
      </div>
    </div>
  );
}

function CreatorCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lemon/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "plus" }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={checkout}
        disabled={loading}
        className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {loading ? "Opening checkout…" : "Get Creator for $7.99/month"}
      </button>

      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function OneShotUnlockButton({ reportId }: { reportId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lemon/checkout-report-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={checkout}
        disabled={loading}
        className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15 disabled:opacity-60"
      >
        {loading ? "Opening checkout…" : "Unlock this report for $2.99"}
      </button>

      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function ConversionBanner({
  reportId,
  isPaid,
  canSeeFull,
  freeFullPreview,
  oneShotUnlocked,
}: {
  reportId: string;
  isPaid: boolean;
  canSeeFull: boolean;
  freeFullPreview: boolean;
  oneShotUnlocked: boolean;
}) {
  if (isPaid) return null;

  if (freeFullPreview) {
    return (
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-white">
          <div className="text-sm font-bold text-emerald-200">
            Your first full report is unlocked.
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
            This is the full Creator experience: complete strategy, rewrite,
            transcript and metrics. Upgrade to Creator to unlock every future
            report automatically.
          </p>
          <div className="mt-4">
            <CreatorCheckoutButton />
          </div>
        </div>
      </div>
    );
  }

  if (oneShotUnlocked) {
    return (
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5 text-white">
          <div className="text-sm font-bold text-indigo-200">
            This report is unlocked.
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
            Want every future report unlocked automatically? Creator includes
            full reports, transcripts, rewrites and history.
          </p>
          <div className="mt-4">
            <CreatorCheckoutButton />
          </div>
        </div>
      </div>
    );
  }

  if (!canSeeFull) {
    return (
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5 text-white">
          <div className="text-sm font-bold text-indigo-200">
            Preview report unlocked. Full report is available.
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
            Unlock the complete strategy, full rewrite, full transcript and
            metrics for this analysis. Or upgrade to Creator to unlock every
            future report.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
            <OneShotUnlockButton reportId={reportId} />
            <CreatorCheckoutButton />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function ReportClient({ reportId }: { reportId: string }) {
  const { plan, isLoading } = useUserPlan();

  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      try {
        const res = await withRetry(
          () => fetch(apiUrl(`/api/report/${reportId}`)),
          {
            retries: 2,
            baseDelayMs: 600,
          },
        );

        const json = (await res.json()) as ReportResponse & { error?: string };

        if (!res.ok || json.error) {
          throw new Error(json.error || "Failed to load report");
        }

        if (cancelled) return;

        setData(json);
        setError(null);

        if (POLLABLE_STATUSES.has(json.status)) {
          timeoutId = setTimeout(load, 2500);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load report");
      }
    }

    load();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reportId]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data || isLoading) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center text-zinc-400">
        Loading report…
      </div>
    );
  }

  if (data.status === "error") {
    return <ProcessingState status="error" />;
  }

  if (data.status !== "done" || !data.report) {
    return <ProcessingState status={data.status} />;
  }

  const isPaid = data.isPaid ?? plan !== "free";
  const canSeeFull = data.canSeeFull ?? isPaid;

  return (
    <>
      <ConversionBanner
        reportId={data.id}
        isPaid={isPaid}
        canSeeFull={canSeeFull}
        freeFullPreview={data.freeFullPreview}
        oneShotUnlocked={data.oneShotUnlocked}
      />

      <ResultsView
        report={data.report}
        viralScore={data.viralScore ?? null}
        transcript={
          canSeeFull
            ? (data.transcript ?? null)
            : (data.transcriptPreview ?? null)
        }
        transcriptPreview={data.transcriptPreview ?? null}
        isPaid={canSeeFull}
        mode={canSeeFull ? "full" : "preview"}
      />
    </>
  );
}
