"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ReportStatus =
  | "queued"
  | "extracting_audio"
  | "transcribing"
  | "analyzing"
  | "done"
  | "error"
  | string;

type StatusResponse = {
  id: string;
  status: ReportStatus;
  viralScore?: number | null;
  createdAt?: string;
  error?: string;
};

function getStatusCopy(status: ReportStatus) {
  switch (status) {
    case "queued":
      return {
        eyebrow: "Queued",
        title: "Your upload was received",
        description: "Your file is in queue and processing will begin shortly.",
      };
    case "extracting_audio":
      return {
        eyebrow: "Preparing media",
        title: "Preparing your file",
        description:
          "We’re extracting and preparing the source so the transcript can be generated.",
      };
    case "transcribing":
      return {
        eyebrow: "Transcribing",
        title: "Building transcript",
        description:
          "We’re converting speech to text before running the deeper analysis.",
      };
    case "analyzing":
      return {
        eyebrow: "Analyzing",
        title: "Building your report",
        description:
          "We’re generating score, insights, rewrite suggestions and recommendations.",
      };
    case "error":
      return {
        eyebrow: "Error",
        title: "This analysis could not be completed",
        description:
          "Try again with a file that has clear speech, enough duration and a supported format.",
      };
    case "done":
      return {
        eyebrow: "Report ready",
        title: "Your report is ready",
        description:
          "Your score, insights and recommendations are ready to review.",
      };
    default:
      return {
        eyebrow: "Processing",
        title: "Your report is still processing",
        description:
          "Open the report page to follow the latest status while we finish the analysis.",
      };
  }
}

function getStatusProgress(status: ReportStatus) {
  switch (status) {
    case "queued":
      return 14;
    case "extracting_audio":
      return 34;
    case "transcribing":
      return 62;
    case "analyzing":
      return 86;
    case "done":
      return 100;
    case "error":
      return 100;
    default:
      return 24;
  }
}

export default function ReportReady({
  reportId,
  isPro,
}: {
  reportId: string;
  isPro: boolean;
}) {
  const [status, setStatus] = useState<ReportStatus>("queued");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      try {
        const res = await fetch(`/api/report-status/${reportId}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as StatusResponse;

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch report status");
        }

        if (cancelled) return;

        setStatus(data.status);
        setLoading(false);

        if (
          data.status === "queued" ||
          data.status === "extracting_audio" ||
          data.status === "transcribing" ||
          data.status === "analyzing"
        ) {
          timeoutId = setTimeout(poll, 2500);
        }
      } catch {
        if (cancelled) return;
        setLoading(false);
        setStatus("error");
      }
    }

    poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reportId]);

  const effectiveStatus = loading ? "queued" : status;
  const copy = getStatusCopy(effectiveStatus);
  const progress = getStatusProgress(effectiveStatus);

  const isDone = status === "done" && !loading;
  const isError = status === "error" && !loading;

  const primaryHref = isError ? "/" : `/report/${reportId}`;
  const primaryLabel = isDone
    ? "Open report"
    : isError
      ? "Try another file"
      : "View live status";

  return (
    <div
      className={[
        "mx-auto w-full max-w-2xl rounded-3xl border p-6 text-center text-white shadow-[0_0_80px_rgba(99,102,241,0.12)] backdrop-blur-xl sm:p-8 md:p-10",
        isDone
          ? "border-emerald-500/20 bg-black/70"
          : isError
            ? "border-rose-500/20 bg-black/60"
            : "border-white/10 bg-black/60",
      ].join(" ")}
    >
      <div className="mx-auto mb-5 flex justify-center">
        <div
          className={[
            "flex h-16 w-16 items-center justify-center rounded-full",
            isDone
              ? "bg-emerald-500/15 shadow-[0_0_30px_rgba(16,185,129,0.18)]"
              : isError
                ? "bg-rose-500/15"
                : "bg-indigo-500/15",
          ].join(" ")}
        >
          <span
            className={[
              "text-3xl font-bold",
              isDone
                ? "text-emerald-400"
                : isError
                  ? "text-rose-400"
                  : "text-indigo-300",
            ].join(" ")}
          >
            {isDone ? "✓" : isError ? "!" : "…"}
          </span>
        </div>
      </div>

      <div
        className={[
          "mb-2 text-xs font-semibold uppercase tracking-[0.22em]",
          isDone
            ? "text-emerald-400/85"
            : isError
              ? "text-rose-400/85"
              : "text-indigo-300/80",
        ].join(" ")}
      >
        {loading ? "Starting" : copy.eyebrow}
      </div>

      <h2
        className={[
          "tracking-tight",
          isDone
            ? "text-4xl font-extrabold sm:text-5xl"
            : "text-2xl font-semibold sm:text-3xl",
        ].join(" ")}
      >
        {loading ? "Preparing your analysis" : copy.title}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        {loading
          ? "We received your file and started the background processing flow."
          : copy.description}
      </p>

      {!isError && (
        <div className="mx-auto mt-8 max-w-xl">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={[
                "h-full rounded-full transition-all duration-700",
                isDone ? "bg-emerald-400" : "bg-indigo-400",
              ].join(" ")}
              style={{ width: `${progress}%` }}
            />
          </div>

          {!isDone && (
            <p className="mt-3 text-xs text-zinc-500">
              Most analyses finish in 1–3 minutes. Large files may take longer.
            </p>
          )}
        </div>
      )}

      {isDone && (
        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          Includes score, strategy insights, rewrite suggestions and transcript
          preview.
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={primaryHref}
          className={[
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold transition sm:w-auto",
            isDone
              ? "bg-indigo-500 text-white hover:bg-indigo-400"
              : isError
                ? "bg-white text-black hover:bg-zinc-200"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
          ].join(" ")}
        >
          {primaryLabel}
          <span>→</span>
        </Link>

        {!isError && (
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/5 sm:w-auto"
          >
            Analyze another file
          </Link>
        )}
      </div>

      {isDone && !isPro && (
        <p className="mt-4 text-xs text-zinc-500">
          Free preview available · Upgrade to unlock full report, rewrite and
          transcript.
        </p>
      )}
    </div>
  );
}
