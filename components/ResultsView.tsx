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

export default function ResultsView({
  data,
}: {
  data: {
    raw?: string;
    transcript?: string;
    plan?: "free" | "pro";
    [key: string]: any;
  };
}) {
  const isPro = data.plan === "pro";

  function copyFullReport() {
    if (!data.raw) return;
    navigator.clipboard.writeText(data.raw);
  }

  function copyTranscript() {
    if (!data.transcript) return;
    navigator.clipboard.writeText(data.transcript);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 pb-24">
      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">
          Analysis complete
        </h1>
        <p className="text-zinc-400">
          Your content is ready to be published smarter.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {isPro ? (
            <>
              <button
                onClick={copyFullReport}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Copy full report
              </button>

              {data.transcript && (
                <button
                  onClick={copyTranscript}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-900"
                >
                  Copy transcript
                </button>
              )}
            </>
          ) : (
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200">
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* ================= TRANSCRIPT ================= */}
      {data.transcript && (
        <details className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <summary className="cursor-pointer text-sm font-medium text-white">
            View full transcript
          </summary>

          <div className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm text-zinc-300">
            {isPro ? (
              data.transcript
            ) : (
              <div className="space-y-4">
                <p className="blur-sm select-none">
                  {data.transcript.slice(0, 400)}…
                </p>
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">
                  Upgrade to unlock full transcript
                </button>
              </div>
            )}
          </div>
        </details>
      )}

      {/* ================= SECTIONS ================= */}
      <div className="space-y-4">
        {SECTION_ORDER.map((key) => {
          const content = data[key];
          if (!content) return null;

          return (
            <SectionBlock
              key={key}
              title={key}
              content={content}
            />
          );
        })}
      </div>

      {/* ================= PRO UPSELL ================= */}
      {!isPro && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
          <h3 className="text-lg font-semibold text-white">
            Want longer videos, transcripts and unlimited analysis?
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Upgrade to Pro and unlock the full power of ViralPulse.
          </p>

          <button className="mt-4 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200">
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
