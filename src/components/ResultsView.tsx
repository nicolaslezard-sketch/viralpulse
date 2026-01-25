"use client";

import SectionBlock from "./SectionBlock";
import type { FullReport } from "@/lib/report/types";
import { REPORT_SECTIONS } from "@/lib/report/sectionNames";

const ACTION_SECTIONS = [
  "TITLE IDEAS",
  "HOOKS",
  "CLIP IDEAS",
  "HASHTAGS",
] as const;

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
    const text = REPORT_SECTIONS.map((key) => {
      const section = report[key];
      if (!section) return "";
      return `${section.title}\n${section.content}`;
    })
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(text);
  }

  function copyTranscript() {
    if (transcript) navigator.clipboard.writeText(transcript);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 pb-24 text-white">
      {/* ================= HEADER ================= */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Analysis complete</h1>

        {!isPro && (
          <div className="rounded-lg bg-zinc-900/60 p-4 text-sm">
            🔒 You’re viewing a preview. Upgrade to unlock full access.
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
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

      {/* ================= READY TO PUBLISH ================= */}
      <div className="rounded-2xl bg-indigo-500/10 p-6 space-y-6">
        <h2 className="text-xl font-semibold">🚀 Ready to publish</h2>

        {REPORT_SECTIONS.filter((k) =>
          ACTION_SECTIONS.includes(k as any)
        ).map((key) => {
          const section = report[key];
          if (!section || !section.content) return null;

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

      {/* ================= FULL ANALYSIS ================= */}
      <div className="space-y-6">
        {REPORT_SECTIONS.filter(
          (k) => !ACTION_SECTIONS.includes(k as any)
        ).map((key) => {
          const section = report[key];
          if (!section || !section.content) return null;

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

      {/* ================= UPSELL ================= */}
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
