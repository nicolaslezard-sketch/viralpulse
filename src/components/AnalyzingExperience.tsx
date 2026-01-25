"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Uploading file", doneAfter: 0 },
  { label: "Transcribing audio", doneAfter: 8 },
  { label: "Analyzing structure", doneAfter: 18 },
  { label: "Detecting viral moments", doneAfter: 30 },
  { label: "Generating hooks & titles", doneAfter: 45 },
  { label: "Finalizing report", doneAfter: 65 },
];

const INSIGHTS = [
  "Detected a strong educational angle",
  "Clear authority tone identified",
  "High potential for short-form platforms",
  "Multiple hook opportunities found",
  "Strong retention potential in first seconds",
  "Content suitable for TikTok & Reels",
];

const PREVIEW_SECTIONS = [
  "Title ideas (10)",
  "Viral hooks (10)",
  "Clip ideas (10)",
  "Hashtag strategy",
  "Platform optimization",
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
    }, 6000);
    return () => clearInterval(i);
  }, []);

  const currentStepIndex = STEPS.reduce(
    (acc, step, i) => (seconds >= step.doneAfter ? i : acc),
    0
  );

  const progress = Math.min(
    Math.round(((currentStepIndex + 1) / STEPS.length) * 100),
    95
  );

  return (
    <div className="p-8 max-w-xl mx-auto space-y-8 fade-up">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Analyzing your content
        </h2>
        <p className="text-sm text-zinc-400">
          We’re turning your audio into viral-ready insights
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div>
        <div className="w-full bg-zinc-800 rounded h-2 overflow-hidden">
          <div
            className="bg-indigo-400 h-2 transition-all duration-700"
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
                i <= currentStepIndex ? "bg-green-400" : "bg-zinc-600"
              }`}
            />
            <span
              className={
                i <= currentStepIndex
                  ? "text-zinc-200"
                  : "text-zinc-500"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* LIVE INSIGHT */}
      <div
        className="
          rounded-xl
          border border-indigo-400/30
          bg-indigo-500/10
          backdrop-blur
          px-4 py-3
          text-sm
          text-indigo-200
          transition-all
        "
      >
        💡 {INSIGHTS[insightIndex]}
      </div>

      {/* PREVIEW */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Preparing your report
        </p>

        <div className="space-y-2">
          {PREVIEW_SECTIONS.map((s, i) => (
            <div
              key={i}
              className="
                rounded-lg
                border border-white/10
                bg-white/5
                px-4 py-2
                text-sm
                text-zinc-300
                backdrop-blur
              "
            >
              🔒 {s}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-center text-xs text-zinc-500">
        ⚠️ Please don’t refresh. Your analysis is running securely in the
        background.
      </p>
    </div>
  );
}
