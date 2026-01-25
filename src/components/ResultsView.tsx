"use client";

import SectionBlock from "./SectionBlock";
import type { FullReport } from "@/lib/report/types";

const SECTION_ORDER = [
  "SUMMARY",
  "VIRAL REASON",
  "KEY MOMENT",
  "HOOKS",
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
  "HOOKS",
  "CLIP IDEAS",
  "HASHTAGS",
];

function handleUpgrade() {
  fetch("/api/stripe/setup-checkout", { method: "POST" }).then(async (r) => {
    const d = await r.json();
    if (d?.url) window.location.href = d.url;
  });
}

type ResultsViewProps = {
  report: FullReport;
  transcript?: string | null;
  isPro: boolean;
};

export default function ResultsView({
  report,
  transcript,
  isPro,
}: ResultsViewProps) {
  function copyFullReport() {
    const text = Object.values(report)
      .map((s) => `${s.title}\n${s.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
  }

  function copyTranscript() {
    if (transcript) navigator.clipboard.writeText(transcript);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 pb-24 text-white">

      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Analysis complete</h1>
        {!isPro && (
          <div className="rounded-lg bg-zinc-900/60 p-4 text-sm">
            🔒 You’re viewing a preview. Upgrade to unlock full access.
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        {isPro ? (
          <>
            <button onClick={copyFullReport} className="btn-primary">
              Copy full report
            </button>
            {transcript && (
              <button onClick={copyTranscript} className="btn-secondary">
                Copy transcript
              </button>
            )}
          </>
        ) : (
          <button onClick={handleUpgrade} className="btn-primary">
            Unlock full report
          </button>
        )}
      </div>

      {/* ACTION SECTIONS */}
      <div className="rounded-2xl bg-indigo-500/10 p-6 space-y-6">
        <h2 className="text-xl font-semibold">🚀 Ready to publish</h2>

        {SECTION_ORDER.filter((k) => ACTION_SECTIONS.includes(k)).map((key) => {
          const section = report[key];
          if (!section) return null;

          return (
            <SectionBlock
              key={key}
              title={section.title}
              content={section.content}
              isPro={isPro}
            />
          );
        })}
      </div>

      {/* OTHER SECTIONS */}
      <div className="space-y-6">
        {SECTION_ORDER.filter((k) => !ACTION_SECTIONS.includes(k)).map((key) => {
          const section = report[key];
          if (!section) return null;

          return (
            <SectionBlock
              key={key}
              title={section.title}
              content={section.content}
              isPro={isPro}
            />
          );
        })}
      </div>

      {!isPro && (
        <div className="rounded-xl bg-zinc-900 p-6 text-center">
          <p className="mb-3">
            Want longer audio, transcripts and unlimited analysis?
          </p>
          <button onClick={handleUpgrade} className="btn-primary">
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
