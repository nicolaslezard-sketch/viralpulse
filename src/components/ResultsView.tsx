"use client";

import Link from "next/link";
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
  transcriptPreview?: string | null;
  isPaid: boolean;
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

function previewText(text: string, maxChars = 220) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, maxChars).trim()}…`;
}

function scoreLabel(score: number) {
  if (score >= 75) {
    return { label: "🔥 High Viral Potential", color: "text-emerald-300" };
  }

  if (score >= 50) {
    return {
      label: "⚡ Decent Potential · Needs Sharpening",
      color: "text-amber-300",
    };
  }

  return {
    label: "🧊 Low Viral Potential · Major Fixes Needed",
    color: "text-rose-300",
  };
}

function LockedUpgradeCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-5 text-center">
      <div className="text-sm font-semibold text-indigo-200">🔒 {title}</div>
      <p className="mt-2 text-sm text-indigo-100/75">{description}</p>
      <Link
        href="/pricing"
        className="mt-4 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        Upgrade now
      </Link>
    </div>
  );
}

export default function ResultsView({
  report,
  viralScore,
  viralMetrics,
  transcript,
  transcriptPreview,
  isPaid,
  mode = "preview",
}: ResultsViewProps) {
  const isFull = mode === "full";
  const score = viralScore ?? 0;
  const { label: scoreText, color: scoreColor } = scoreLabel(score);

  const summary = report?.sections?.["SUMMARY"];
  const longevity = report?.sections?.["PREDICTED LONGEVITY"];

  const reportForInsights: FullReport = {
    ...report,
    sections: Object.fromEntries(
      Object.entries(report.sections || {}).filter(
        ([key]) =>
          key !== "REWRITE" && key !== "AI_REWRITE" && key !== "VIRAL_REWRITE",
      ),
    ),
  };

  async function handleUpgrade() {
    const res = await fetch("/api/lemon/checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "plus" }),
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

  const transcriptTeaser =
    transcriptPreview && transcriptPreview.trim().length > 0
      ? transcriptPreview
      : transcript && transcript.trim().length > 0
        ? previewText(transcript, 180)
        : "Your transcript preview will appear here after processing, so you can quickly review wording, pacing and clarity before publishing.";

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-6 pb-32 text-white">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Content Command Center
          </h1>

          <p className="max-w-2xl text-sm text-zinc-400">
            {isPaid
              ? "Optimize your content before publishing."
              : "See what is working, where it breaks, and unlock the full optimization layer."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isPaid && isFull ? (
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
              Unlock full report
            </button>
          )}
        </div>
      </div>

      {!isPaid && (
        <div className="rounded-3xl border border-indigo-500/25 bg-indigo-500/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-indigo-200">
                Free preview unlocked
              </div>
              <p className="mt-2 max-w-2xl text-sm text-indigo-100/75">
                You can already see the core diagnosis. Upgrade to unlock the
                full transcript, full rewrite, deeper insights and performance
                analytics.
              </p>
            </div>

            <Link
              href="/pricing"
              className="inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              See plans
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className={`text-6xl font-extrabold ${scoreColor}`}>
              {score}
              <span className="text-2xl text-white/60"> / 100</span>
            </div>

            <div className="mt-2 text-lg font-semibold">{scoreText}</div>

            {viralMetrics && isPaid && (
              <div className="mt-4 flex gap-3 text-xs text-zinc-300">
                <span>Hook: {viralMetrics.hookStrength}</span>
                <span>Retention: {viralMetrics.retentionPotential}</span>
                <span>Emotion: {viralMetrics.emotionalImpact}</span>
                <span>Shareability: {viralMetrics.shareability}</span>
              </div>
            )}

            {summary && (
              <div className="mt-4 text-sm text-zinc-300">
                <b>Instant read:</b> {firstLine(summary.content)}
              </div>
            )}
          </div>

          {longevity && (
            <div className="max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200">
              <div className="text-xs font-semibold text-white/70">
                Predicted longevity
              </div>

              {isPaid ? (
                <div className="mt-2">{firstLine(longevity.content)}</div>
              ) : (
                <div className="relative mt-3 overflow-hidden">
                  <div className="text-zinc-300">
                    {previewText(firstLine(longevity.content), 90)}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-[#2b2d66] to-transparent" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <details className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <summary className="cursor-pointer text-lg font-semibold">
          Strategy Insights
        </summary>

        <div className="mt-8 space-y-12">
          <InsightBlock
            title="Core Insights"
            sections={SECTION_GROUPS.core}
            report={reportForInsights}
            isPaid={isPaid}
          />

          <InsightBlock
            title="Growth Ideas"
            sections={SECTION_GROUPS.growth}
            report={reportForInsights}
            isPaid={isPaid}
          />

          <InsightBlock
            title="Distribution Strategy"
            sections={SECTION_GROUPS.distribution}
            report={reportForInsights}
            isPaid={isPaid}
          />

          <InsightBlock
            title="Advanced Strategy"
            sections={SECTION_GROUPS.advanced}
            report={reportForInsights}
            isPaid={isPaid}
          />
        </div>
      </details>

      <details className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <summary className="cursor-pointer text-lg font-semibold">
          ✨ AI Viral Rewrite
        </summary>

        <div className="mt-6">
          {report.rewrite ? (
            <RewriteBlock rewrite={report.rewrite} isPaid={isPaid} />
          ) : (
            <LockedUpgradeCard
              title="AI Rewrite"
              description="Unlock a stronger hook, tighter delivery and clearer wording optimized for retention."
            />
          )}
        </div>
      </details>

      <details className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <summary className="cursor-pointer text-lg font-semibold">
          Full Transcript
        </summary>

        {isPaid ? (
          transcript ? (
            <pre className="mt-6 whitespace-pre-wrap text-sm text-zinc-300">
              {transcript}
            </pre>
          ) : (
            <div className="mt-6 text-sm text-zinc-400">
              Transcript not available.
            </div>
          )
        ) : (
          <div className="mt-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5">
              <pre className="whitespace-pre-wrap text-sm text-zinc-300">
                {transcriptTeaser}
              </pre>

              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#2b2d66] via-[#2b2d66]/95 to-transparent" />

              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <Link
                  href="/pricing"
                  className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                >
                  Unlock full transcript
                </Link>
              </div>
            </div>
          </div>
        )}
      </details>

      {!isPaid && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-lg font-semibold">Performance Analytics</div>

          <div className="mt-6 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-6 text-center">
            <div className="text-sm font-semibold text-indigo-200">
              🔒 Unlock performance analytics
            </div>

            <p className="mt-2 text-sm text-indigo-100/75">
              Track score evolution, trends and performance insights across all
              your content.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex h-48 items-end justify-between gap-3 opacity-35">
                <div
                  className="w-full rounded-t-xl bg-white/10"
                  style={{ height: "28%" }}
                />
                <div
                  className="w-full rounded-t-xl bg-white/10"
                  style={{ height: "40%" }}
                />
                <div
                  className="w-full rounded-t-xl bg-white/10"
                  style={{ height: "34%" }}
                />
                <div
                  className="w-full rounded-t-xl bg-white/10"
                  style={{ height: "52%" }}
                />
                <div
                  className="w-full rounded-t-xl bg-white/10"
                  style={{ height: "43%" }}
                />
                <div
                  className="w-full rounded-t-xl bg-white/10"
                  style={{ height: "65%" }}
                />
              </div>
            </div>

            <Link
              href="/pricing"
              className="mt-6 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Upgrade now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
