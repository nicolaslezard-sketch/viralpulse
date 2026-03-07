"use client";

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
        description:
          "We queued your analysis successfully. Processing will start shortly.",
      };
    case "extracting_audio":
      return {
        eyebrow: "Preparing media",
        title: "Extracting audio",
        description:
          "We’re preparing your media file so the transcript can be generated.",
      };
    case "transcribing":
      return {
        eyebrow: "Transcribing",
        title: "Creating transcript",
        description:
          "We’re converting speech to text before running the AI analysis.",
      };
    case "analyzing":
      return {
        eyebrow: "Analyzing",
        title: "Building your report",
        description:
          "We’re generating viral insights, score and rewrite recommendations.",
      };
    case "error":
      return {
        eyebrow: "Error",
        title: "We could not complete this analysis",
        description:
          "Please try again with a file that has clear speech and enough duration.",
      };
    case "done":
      return {
        eyebrow: "Report ready",
        title: "Your report is ready",
        description:
          "We’ve finished analyzing your content and generated clear, actionable insights optimized for virality.",
      };
    default:
      return {
        eyebrow: "Processing",
        title: "Your report is processing",
        description:
          "We’re still working on it. Open the report page to follow the live status.",
      };
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

  const copy = getStatusCopy(status);
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div
      className="
        mt-8 sm:mt-12
        mx-auto w-full max-w-xl
        rounded-3xl
        border border-white/10
        bg-black/60
        backdrop-blur-xl
        p-6 sm:p-8 md:p-10
        text-center
        text-white
        shadow-[0_0_80px_rgba(99,102,241,0.12)]
      "
    >
      <div className="mx-auto mb-4 flex justify-center sm:mb-5">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
            isDone
              ? "bg-emerald-500/15"
              : isError
                ? "bg-rose-500/15"
                : "bg-indigo-500/15"
          }`}
        >
          <span
            className={`text-xl font-bold sm:text-2xl ${
              isDone
                ? "text-emerald-400"
                : isError
                  ? "text-rose-400"
                  : "text-indigo-300"
            }`}
          >
            {isDone ? "✓" : isError ? "!" : "…"}
          </span>
        </div>
      </div>

      <div
        className={`mb-2 text-xs font-semibold uppercase tracking-wide ${
          isDone
            ? "text-emerald-400/80"
            : isError
              ? "text-rose-400/80"
              : "text-indigo-300/80"
        }`}
      >
        {loading ? "Starting" : copy.eyebrow}
      </div>

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {loading ? "Preparing your analysis" : copy.title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
        {loading
          ? "We received your file and are starting the background processing flow."
          : copy.description}
      </p>

      {!isDone && !isError && (
        <div className="mx-auto mt-6 max-w-md">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-400" />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center sm:mt-8">
        <a
          href={`/report/${reportId}`}
          className="
            inline-flex w-full items-center justify-center gap-2
            sm:w-auto
            rounded-2xl
            px-8 py-3
            text-sm font-semibold text-white
            transition
            border border-white/10
            bg-white/5
            hover:bg-white/10
          "
        >
          {isDone
            ? "Open report"
            : isError
              ? "Open status page"
              : "View progress"}
          <span>→</span>
        </a>
      </div>

      {isDone && !isPro && (
        <p className="mt-4 text-xs text-zinc-500">
          Preview available · Upgrade to unlock full access
        </p>
      )}
    </div>
  );
}
