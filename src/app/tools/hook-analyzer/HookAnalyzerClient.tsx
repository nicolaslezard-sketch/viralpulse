"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Result = {
  score: number;
  mainIssue: string;
  whyPeopleMaySkip: string;
  betterHook: string;
  rewrittenScript: string;
  titleIdeas: string[];
  ctaSuggestion: string;
  platformAdvice: string;
};

const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Podcast Clip",
  "LinkedIn Video",
];

const GOALS = [
  "grow audience",
  "sell a product",
  "educate",
  "entertain",
  "build personal brand",
];

export default function HookAnalyzerClient() {
  const [script, setScript] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const chars = script.length;

  const scoreLabel = useMemo(() => {
    if (!result) return "";
    if (result.score >= 80) return "Strong";
    if (result.score >= 60) return "Promising";
    if (result.score >= 40) return "Needs work";
    return "Weak";
  }, [result]);

  async function analyze() {
    setError("");
    setResult(null);

    const trimmed = script.trim();

    if (trimmed.length < 20) {
      setError("Paste at least 20 characters so ViralPulse has something to analyze.");
      return;
    }

    if (trimmed.length > 4000) {
      setError("Keep the script under 4,000 characters for this free analyzer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tools/hook-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: trimmed,
          platform,
          goal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Analysis failed.");
      }

      setResult(data as Result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not analyze this script right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-zinc-200">
                Paste your hook, idea or script
              </label>
              <p className="mt-1 text-xs text-zinc-500">
                Best input: the first 5–30 seconds of your video.
              </p>
            </div>

            <textarea
              value={script}
              onChange={(event) => setScript(event.target.value)}
              placeholder={`Example:\nMost creators post every day but still don't grow. The problem is not consistency. It's that their first 3 seconds give people no reason to stay.`}
              className="min-h-72 resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-400/60"
            />

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{chars}/4000 characters</span>
              <span>No file upload needed</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Platform
                </span>
                <select
                  value={platform}
                  onChange={(event) => setPlatform(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                >
                  {PLATFORMS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Goal
                </span>
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                >
                  {GOALS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={loading}
              className="rounded-2xl bg-indigo-500 px-5 py-4 text-sm font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze my hook"}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl md:p-6">
          {!result ? (
            <EmptyState />
          ) : (
            <div>
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-zinc-400">Hook Score</div>
                  <div className="mt-1 flex items-end gap-3">
                    <div className="text-5xl font-extrabold">
                      {result.score}
                    </div>
                    <div className="pb-1 text-sm font-semibold text-indigo-300">
                      {scoreLabel}
                    </div>
                  </div>
                </div>

                <Link
                  href="/#analyze"
                  className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-center text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
                >
                  Analyze full audio/video
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                <ResultCard title="Main issue" text={result.mainIssue} />
                <ResultCard
                  title="Why people may skip"
                  text={result.whyPeopleMaySkip}
                />
                <ResultCard title="Better hook" text={result.betterHook} strong />
                <ResultCard
                  title="Rewritten script"
                  text={result.rewrittenScript}
                  large
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Title ideas
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    {result.titleIdeas.map((title) => (
                      <li key={title}>• {title}</li>
                    ))}
                  </ul>
                </div>

                <ResultCard title="CTA suggestion" text={result.ctaSuggestion} />
                <ResultCard
                  title="Platform advice"
                  text={result.platformAdvice}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[520px] flex-col justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">
        ⚡
      </div>
      <h2 className="mt-5 text-2xl font-bold">Your analysis will appear here</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
        Paste a hook, video intro, content idea or rough script. ViralPulse will
        show what is weak, rewrite the opening and suggest better titles.
      </p>

      <div className="mt-8 grid gap-3 text-left text-sm text-zinc-400 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          ✔ Hook score
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          ✔ Better opening
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          ✔ Script rewrite
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          ✔ Platform advice
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  text,
  strong,
  large,
}: {
  title: string;
  text: string;
  strong?: boolean;
  large?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p
        className={[
          "mt-3 whitespace-pre-wrap leading-relaxed",
          large ? "text-sm text-zinc-300" : "text-sm text-zinc-400",
          strong ? "text-base font-semibold text-indigo-200" : "",
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}
