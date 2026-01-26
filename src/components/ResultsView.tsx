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
  withRetry(
    () => fetch(apiUrl("/api/stripe/setup-checkout"), { method: "POST" }),
    { retries: 2, baseDelayMs: 600 }
  ).then(async (r) => {
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
    <div className="mx-auto max-w-5xl space-y-16 px-6 pb-32 text-white">
      {/* ================= HEADER ================= */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Viral Content Analysis
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Actionable insights designed to improve reach, retention and engagement.
        </p>

        {!isPro && mode === "preview" && (
          <div
            className="
              mt-4 inline-flex items-center gap-2
              rounded-full
              border border-white/10
              bg-zinc-900/70
              px-4 py-1.5
              text-xs font-medium text-zinc-300
              backdrop-blur
            "
          >
            <span className="text-indigo-300">🔒</span>
            You’re viewing a preview · Upgrade to unlock full access
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-wrap items-center gap-4">
        {isPro && mode === "full" ? (
          <>
            <button
              onClick={copyFullReport}
              className="
                inline-flex items-center justify-center
                rounded-full
                border border-white/10
                bg-white/5
                px-5 py-2.5
                text-sm font-semibold text-white
                shadow-sm
                hover:bg-white/8
                hover:border-white/20
                transition
              "
            >
              Copy full report
            </button>

            {transcript && (
              <button
                onClick={copyTranscript}
                className="
                  inline-flex items-center justify-center
                  rounded-full
                  border border-white/10
                  bg-zinc-950/40
                  px-5 py-2.5
                  text-sm font-semibold text-zinc-200
                  hover:bg-white/5
                  hover:border-white/20
                  transition
                "
              >
                Copy transcript
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleUpgrade}
            className="
              inline-flex items-center justify-center
              rounded-full
              bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500
              px-6 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-indigo-500/30
              hover:brightness-110
              transition
            "
          >
            Unlock full report
          </button>
        )}
      </div>

      {/* ================= SECTIONS ================= */}
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

      {/* ================= OPEN FULL REPORT ================= */}
      {mode === "preview" && reportId && (
        <div className="pt-2">
          <div
            className="
              relative overflow-hidden
              rounded-3xl
              border border-white/10
              bg-gradient-to-b from-zinc-900/70 to-zinc-950/90
              p-8
              text-center
              shadow-[0_20px_50px_-30px_rgba(0,0,0,0.85)]
              backdrop-blur-xl
            "
          >
            <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-zinc-300">
              You’re currently seeing the preview. Open the full report page to
              view your complete analysis.
            </p>

            <a
              href={`/report/${reportId}`}
              className="
                inline-flex items-center justify-center gap-2
                rounded-full
                bg-white/5
                px-7 py-3
                text-sm font-semibold text-white
                border border-white/10
                hover:bg-white/8
                hover:border-white/20
                transition
              "
            >
              Open full report →
            </a>
          </div>
        </div>
      )}

      {/* ================= UPSELL ================= */}
      {!isPro && mode === "full" && (
        <div
          className="
            relative overflow-hidden
            rounded-3xl
            border border-white/10
            bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent
            p-10
            text-center
            shadow-[0_0_80px_-20px_rgba(99,102,241,0.45)]
            backdrop-blur-xl
          "
        >
          <div
            className="
              pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_55%)]
            "
          />
          <div className="relative">
            <h2 className="mb-3 text-3xl font-semibold tracking-tight">
              Unlock the full viral potential of your content
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-zinc-300">
              Want longer audio, transcripts and unlimited analysis? Get full
              insights, complete transcripts and unlimited analysis with
              ViralPulse Pro.
            </p>

            <button
              onClick={handleUpgrade}
              className="
                inline-flex items-center justify-center
                rounded-full
                bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500
                px-10 py-4
                text-base font-semibold text-white
                shadow-xl shadow-indigo-500/40
                hover:brightness-110
                transition
              "
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
