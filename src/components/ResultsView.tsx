"use client";

import type { FullReport } from "@/lib/report/types";
import { InsightBlock } from "@/components/report/InsightBlock";
import { RewriteBlock } from "@/components/report/RewriteBlock";
import { SECTION_GROUPS } from "@/lib/report/sectionGroups";
import { REPORT_SECTIONS } from "@/lib/report/sectionNames";

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
  const score = viralScore ?? 0;
  const { label: scoreText, color: scoreColor } = scoreLabel(score);

  const summary = report?.sections?.["SUMMARY"];
  const longevity = report?.sections?.["PREDICTED LONGEVITY"];
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
      const s = report?.sections?.[key];
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

        <div className="mt-8 space-y-12">
          <InsightBlock
            title="Core Insights"
            sections={SECTION_GROUPS.core}
            report={report}
            isPro={isPro}
          />

          <InsightBlock
            title="Growth Ideas"
            sections={SECTION_GROUPS.growth}
            report={report}
            isPro={isPro}
          />

          <InsightBlock
            title="Distribution Strategy"
            sections={SECTION_GROUPS.distribution}
            report={report}
            isPro={isPro}
          />

          <InsightBlock
            title="Advanced Strategy"
            sections={SECTION_GROUPS.advanced}
            report={report}
            isPro={isPro}
          />

          {isPro && report.rewrite && <RewriteBlock rewrite={report.rewrite} />}
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
