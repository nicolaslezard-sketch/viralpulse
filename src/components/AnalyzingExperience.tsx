"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Uploading file", doneAfter: 0 },
  { label: "Preparing media", doneAfter: 6 },
  { label: "Building transcript", doneAfter: 16 },
  { label: "Analyzing content", doneAfter: 32 },
  { label: "Preparing your report", doneAfter: 52 },
];

const INSIGHTS = [
  "Scoring hook strength and retention potential",
  "Building your transcript for deeper context",
  "Generating strategy insights and viral takeaways",
  "Preparing rewrite suggestions and stronger framing",
  "Structuring your report for quick review",
];

const PREVIEW_SECTIONS = [
  "Viral score",
  "Strategy insights",
  "AI rewrite",
  "Transcript preview",
  "Performance recommendations",
];

export default function AnalyzingExperience() {
  const [seconds, setSeconds] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setInsightIndex((i) => (i + 1) % INSIGHTS.length);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  const currentStepIndex = STEPS.reduce(
    (acc, step, i) => (seconds >= step.doneAfter ? i : acc),
    0,
  );

  const progress = Math.min(
    Math.round(((currentStepIndex + 1) / STEPS.length) * 100),
    94,
  );

  return (
    <div className="mx-auto max-w-xl space-y-8 rounded-3xl border border-white/10 bg-black/25 p-8 fade-up backdrop-blur">
      {/* HEADER */}
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/15">
          <span className="text-2xl font-bold text-indigo-300">…</span>
        </div>

        <h2 className="text-2xl font-semibold text-white">
          Analyzing your content
        </h2>

        <p className="text-sm text-zinc-400">
          We’re turning your file into a publish-ready report.
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div>
        <div className="h-2 w-full overflow-hidden rounded bg-zinc-800">
          <div
            className="h-2 rounded bg-indigo-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-center text-xs text-zinc-400">
          {progress}% · {STEPS[currentStepIndex].label}
        </p>
      </div>

      {/* STEPS LIST */}
      <div className="space-y-2 text-sm">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                i <= currentStepIndex ? "bg-emerald-400" : "bg-zinc-600"
              }`}
            />
            <span
              className={
                i <= currentStepIndex ? "text-zinc-200" : "text-zinc-500"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* LIVE STATUS */}
      <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200 backdrop-blur transition-all">
        💡 {INSIGHTS[insightIndex]}
      </div>

      {/* PREVIEW SHELL */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Preparing your report
        </p>

        <div className="space-y-2">
          {PREVIEW_SECTIONS.map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur"
            >
              🔒 {s}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-center text-xs text-zinc-500">
        Most analyses finish in 1–3 minutes. Large files may take longer.
      </p>
    </div>
  );
}
