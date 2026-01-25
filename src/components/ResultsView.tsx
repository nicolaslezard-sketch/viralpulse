"use client";

import SectionBlock from "./SectionBlock";

const SECTION_ORDER = [
  "SUMMARY",
  "VIRAL REASON",
  "KEY MOMENT",
  "HOOK IDEAS",
  "TITLE IDEAS",
  "HASHTAGS",
  "REMIX IDEAS",
  "CLIP IDEAS",
  "PLATFORM STRATEGY",
  "WHAT TO FIX",
  "REPLICATION FRAMEWORK",
];

const ACTION_SECTIONS = [
  "TITLE IDEAS",
  "HOOK IDEAS",
  "CLIP IDEAS",
  "HASHTAGS",
];

function handleUpgrade() {
  fetch("/api/stripe/setup-checkout", {
    method: "POST",
  }).then(async (r) => {
    const d = await r.json();
    if (d?.url) window.location.href = d.url;
  });
}

type ResultsViewProps = {
  report: Record<string, string>;
  transcript?: string | null;
  isPro: boolean;
};

export default function ResultsView({
  report,
  transcript,
  isPro,
}: ResultsViewProps) {
  function copyFullReport() {
    navigator.clipboard.writeText(
      Object.entries(report)
        .map(([title, content]) => `${title}\n${content}`)
        .join("\n\n")
    );
  }

  function copyTranscript() {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 pb-24">
      {/* ================= HEADER ================= */}
      <div className="mb-10 space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              ✓
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Analysis complete
            </h1>
          </div>

          <p className="text-sm text-zinc-400">
            Your content is ready to be published smarter
          </p>
        </div>

        {/* FREE NOTICE */}
        {!isPro && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
            <span className="mr-2">🔒</span>
            You’re viewing a preview.
            <span className="ml-1 text-zinc-400">
              Upgrade to unlock the full report, transcript & longer uploads.
            </span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          {isPro ? (
            <>
              <button
                onClick={copyFullReport}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition"
              >
                Copy full report
              </button>

              {transcript && (
                <button
                  onClick={copyTranscript}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-900 transition"
                >
                  Copy transcript
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleUpgrade}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition"
            >
              Unlock full report
            </button>
          )}
        </div>
      </div>

      {/* ================= TRANSCRIPT ================= */}
      {transcript && (
        <details className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <summary className="cursor-pointer text-sm font-medium text-white">
            View full transcript
          </summary>

          <div className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm text-zinc-300">
            {isPro ? (
              transcript
            ) : (
              <p className="blur-sm select-none">
                {transcript.slice(0, 400)}…
              </p>
            )}
          </div>
        </details>
      )}

      {/* ================= ACTION SECTIONS ================= */}
      <div className="mb-12 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            🚀 Ready to publish
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Titles, hooks, clips and hashtags you can copy and post immediately
          </p>
        </div>

        <div className="space-y-6">
          {SECTION_ORDER.filter((key) =>
            ACTION_SECTIONS.includes(key)
          ).map((key) => {
            const content = report[key];
            if (!content) return null;

            return (
              <SectionBlock
                key={key}
                title={key}
                content={content}
                isPro={isPro}
              />
            );
          })}
        </div>
      </div>

      {/* ================= OTHER SECTIONS ================= */}
      <div className="space-y-4">
        {SECTION_ORDER.filter(
          (key) => !ACTION_SECTIONS.includes(key)
        ).map((key) => {
          const content = report[key];
          if (!content) return null;

          return (
            <SectionBlock
              key={key}
              title={key}
              content={content}
              isPro={isPro}
            />
          );
        })}
      </div>

      {/* ================= PRO UPSELL ================= */}
      {!isPro && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
          <h3 className="text-lg font-semibold text-white">
            Want longer audio, transcripts and unlimited analysis?
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Upgrade to Pro and unlock the full power of ViralPulse.
          </p>

          <button
            onClick={handleUpgrade}
            className="mt-4 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
