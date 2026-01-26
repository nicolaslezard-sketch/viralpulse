"use client";

import SectionBlock from "./SectionBlock";
import type { FullReport } from "@/lib/report/types";
import { REPORT_SECTIONS } from "@/lib/report/sectionNames";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";

const ACTION_SECTIONS = [
  "TITLE IDEAS",
  "HOOKS",
  "CLIP IDEAS",
  "HASHTAGS",
] as const;

// qué se ve en preview
const PREVIEW_SECTIONS = [
  "SUMMARY",
  "HOOKS",
  "TITLE IDEAS",
  "CLIP IDEAS",
  "HASHTAGS",
] as const;

function handleUpgrade() {
  withRetry(() => fetch(apiUrl("/api/stripe/setup-checkout"), { method: "POST" }), { retries: 2, baseDelayMs: 600 }).then(async (r) => {
    const d = await r.json();
    if (d?.url) window.location.href = d.url;
  });
}

type ResultsViewProps = {
  report: FullReport;
  transcript?: string | null;
  isPro: boolean;
  mode?: "preview" | "full";
  reportId?: string; // 👈 para linkear al full
};




export default function ResultsView({
  report,
  transcript,
  isPro,
  mode = "preview",
  reportId,
}: ResultsViewProps) {
  const sectionsToRender =
    mode === "preview" ? PREVIEW_SECTIONS : REPORT_SECTIONS;

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

        {!isPro && mode === "preview" && (
          <div className="rounded-lg bg-zinc-900/60 p-4 text-sm">
            🔒 You’re viewing a preview. Upgrade to unlock full access.
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-3">
        {isPro && mode === "full" ? (
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

      {/* ================= SECTIONS ================= */}
      <div className="space-y-6">
        {sectionsToRender.map((key) => {
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

      {/* ================= OPEN FULL REPORT ================= */}
      {mode === "preview" && reportId && (
        <div className="pt-8 text-center">
          <a
            href={`/report/${reportId}`}
            className="
              inline-flex items-center gap-2
              rounded-full bg-indigo-500 px-6 py-3
              text-sm font-semibold text-white
              hover:bg-indigo-400 transition
            "
          >
            Open full report →
          </a>
        </div>
      )}

      {/* ================= UPSELL ================= */}
      {!isPro && mode === "full" && (
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
