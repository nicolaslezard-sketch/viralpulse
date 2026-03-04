"use client";

import SectionBlock from "./SectionBlock";
import type { FullReport } from "@/lib/report/types";
import {
  REPORT_SECTIONS,
  type ReportSectionKey,
} from "@/lib/report/sectionNames";

const PREVIEW_SECTIONS: ReportSectionKey[] = [
  "SUMMARY",
  "HOOKS",
  "TITLE IDEAS",
  "CLIP IDEAS",
  "HASHTAGS",
];

type ResultsViewProps = {
  report: FullReport;
  viralScore?: number | null;
  viralMetrics?: {
    hookStrength: number;
    retentionPotential: number;
    emotionalImpact: number;
    shareability: number;
    finalScore: number;
  } | null;
  transcript?: string | null;
  isPro: boolean;
  mode?: "preview" | "full";
  reportId?: string;
};

function firstLine(text: string) {
  return (
    text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0] ?? text
  );
}

function takeLines(text: string, n: number) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, n)
    .map((l) => `- ${l}`)
    .join("\n");
}

function extractTags(text?: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.replace(/^-/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

function scoreLabel(score: number) {
  if (score >= 75)
    return { label: "🔥 High Viral Potential", color: "text-emerald-300" };
  if (score >= 50)
    return {
      label: "⚡ Decent Potential · Needs Sharpening",
      color: "text-amber-300",
    };
  return {
    label: "🧊 Low Viral Potential · Major Fixes Needed",
    color: "text-rose-300",
  };
}

export default function ResultsView({
  report,
  viralScore,
  viralMetrics,
  transcript,
  isPro,
  mode = "preview",
}: ResultsViewProps) {
  const isFull = mode === "full";
  const sections = mode === "preview" ? PREVIEW_SECTIONS : REPORT_SECTIONS;

  const score = viralScore ?? 0;
  const { label: scoreText, color: scoreColor } = scoreLabel(score);

  const summary = report["SUMMARY"];
  const longevity = report["PREDICTED LONGEVITY"];
  const hooks = report["HOOKS"];
  const titles = report["TITLE IDEAS"];
  const clipIdeas = report["CLIP IDEAS"];
  const keyMoment = report["KEY MOMENT"];
  const performanceTags = report["PERFORMANCE TAGS" as ReportSectionKey];

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
      const s = report[key];
      if (!s) return "";
      return `${s.title}\n${s.content}`;
    })
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(text);
  }

  function copyTranscript() {
    if (transcript) navigator.clipboard.writeText(transcript);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-6 pb-32 text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Content Command Center
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Optimize your content before publishing.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {isPro && isFull ? (
            <>
              <button
                onClick={copyFullReport}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold"
              >
                Copy full report
              </button>
              {transcript && (
                <button
                  onClick={copyTranscript}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold"
                >
                  Copy transcript
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleUpgrade}
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold"
            >
              Unlock full command center
            </button>
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
          <div>
            <div className={`text-6xl font-extrabold ${scoreColor}`}>
              {score}
              <span className="text-2xl text-white/60"> / 100</span>
            </div>

            <div className="mt-2 text-lg font-semibold">{scoreText}</div>

            {viralMetrics && (
              <div className="mt-4 flex gap-3 text-xs text-zinc-300">
                <span>Hook: {viralMetrics.hookStrength}</span>
                <span>Retention: {viralMetrics.retentionPotential}</span>
                <span>Emotion: {viralMetrics.emotionalImpact}</span>
                <span>Shareability: {viralMetrics.shareability}</span>
              </div>
            )}

            {isPro && summary && (
              <div className="mt-4 text-sm text-zinc-300">
                <b>Instant read:</b> {firstLine(summary.content)}
              </div>
            )}

            {isPro && performanceTags && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {extractTags(performanceTags.content).map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isPro && longevity && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200 max-w-sm">
              <div className="text-xs font-semibold text-white/70">
                Predicted longevity
              </div>
              <div className="mt-2">{firstLine(longevity.content)}</div>
            </div>
          )}
        </div>
      </div>

      {/* STRATEGY */}
      <details className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <summary className="cursor-pointer text-lg font-semibold">
          Strategy Insights
        </summary>

        <div className="mt-6 space-y-6">
          {sections.map((key) => {
            const s = report[key];
            if (!s) return null;

            return (
              <SectionBlock
                key={key}
                title={s.title}
                content={s.content}
                isPro={isPro}
              />
            );
          })}
        </div>
      </details>

      {/* TRANSCRIPT */}
      {transcript && (
        <details className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <summary className="cursor-pointer text-lg font-semibold">
            Full Transcript
          </summary>

          {isPro ? (
            <pre className="mt-6 whitespace-pre-wrap text-sm text-zinc-300">
              {transcript}
            </pre>
          ) : (
            <div className="mt-6 text-sm text-zinc-300">
              Upgrade to unlock transcript.
            </div>
          )}
        </details>
      )}
    </div>
  );
}
