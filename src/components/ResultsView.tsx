"use client";

import SectionBlock from "./SectionBlock";
import type { FullReport } from "@/lib/report/types";
import { REPORT_SECTIONS } from "@/lib/report/sectionNames";

const PREVIEW_SECTIONS = [
  "SUMMARY",
  "HOOKS",
  "TITLE IDEAS",
  "CLIP IDEAS",
  "HASHTAGS",
] as const;

type ResultsViewProps = {
  report: FullReport;
  transcript?: string | null;
  isPro: boolean;
  mode?: "preview" | "full";
  reportId?: string;
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

  async function handleUpgrade() {
    const res = await fetch("/api/lemon/checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

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
    <div className="mx-auto max-w-5xl space-y-16 px-6 pb-32 text-white">
      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Viral Content Analysis
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Actionable insights designed to improve reach, retention and engagement.
        </p>

        {!isPro && mode === "preview" && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/70 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur">
            <span className="text-indigo-300">🔒</span>
            You’re viewing a preview · Unlock the full viral analysis
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center gap-4">
        {isPro && mode === "full" ? (
          <>
            <button
              onClick={copyFullReport}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:border-white/20"
            >
              Copy full report
            </button>

            {transcript && (
              <button
                onClick={copyTranscript}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:border-white/20"
              >
                Copy transcript
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleUpgrade}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:brightness-110"
          >
            Unlock full viral analysis
          </button>
        )}
      </div>

      {/* SECTIONS */}
      <div className="space-y-8">
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

      {/* OPEN FULL REPORT (from preview) */}
      {mode === "preview" && reportId && (
        <div className="pt-2 text-center">
          <a
            href={`/report/${reportId}`}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold hover:border-white/20"
          >
            Open full report →
          </a>
        </div>
      )}

      {/* FINAL UPSELL */}
      {!isPro && mode === "full" && (
        <div className="rounded-3xl border border-white/10 bg-indigo-600/15 p-10 text-center backdrop-blur-xl">
          <h2 className="mb-3 text-3xl font-semibold">
            Unlock the full viral potential
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-sm text-zinc-300">
            Get all 18 insights, full transcript and copy tools with Pro.
          </p>

          <button
            onClick={handleUpgrade}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 px-10 py-4 text-base font-semibold shadow-xl shadow-indigo-500/40 hover:brightness-110"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
