"use client";

import { useEffect, useState } from "react";
import { useUserPlan } from "@/lib/useUserPlan";
import Link from "next/link";
import UsageIndicator from "@/components/analysis/UsageIndicator";
import ScoreChart from "@/components/history/ScoreChart";

type ReportSection = {
  title: string;
  content: string;
};

type FullReport = Record<string, ReportSection>;

type HistoryItem = {
  id: string;
  createdAt: string;
  durationSec?: number | null;
  originalName?: string | null;
  viralScore?: number | null;
  reportFull?: FullReport | null;
  reportFree?: FullReport | null;
};

export default function HistoryPage() {
  const { plan } = useUserPlan();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  type SortOption = "newest" | "best" | "worst";
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    if (plan === "free") return;

    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load history");
        return r.json();
      })
      .then((d) => setItems(d.reports))
      .catch((e) => setError(e.message));
  }, [plan]);

  const enriched = items.map((item, index) => {
    const report = item.reportFull ?? item.reportFree ?? null;

    const score = item.viralScore ?? null;

    const prev = items[index + 1];
    const prevScore = prev?.viralScore ?? null;

    const delta =
      score !== null && prevScore !== null ? score - prevScore : null;

    const summary =
      report?.["SUMMARY"]?.content?.split("\n").filter(Boolean)[0] ?? null;

    return {
      ...item,
      score,
      delta,
      summary,
    };
  });

  const scored = enriched.filter((r) => r.score !== null);
  const sorted = [...enriched].sort((a, b) => {
    if (sort === "best") {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    }

    if (sort === "worst") {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return a.score - b.score;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const chartData = sorted
    .filter((r) => r.score !== null)
    .map((r) => ({
      date: r.createdAt,
      score: r.score as number,
    }))
    .reverse();

  const average =
    scored.length > 0
      ? Math.round(
          scored.reduce((acc, r) => acc + (r.score as number), 0) /
            scored.length,
        )
      : null;

  const best =
    scored.length > 0
      ? Math.max(...scored.map((r) => r.score as number))
      : null;

  const worst =
    scored.length > 0
      ? Math.min(...scored.map((r) => r.score as number))
      : null;

  // Trend calculation
  let trend: "up" | "down" | "stable" | null = null;

  if (scored.length >= 4) {
    const mid = Math.floor(scored.length / 2);

    const firstHalf = scored.slice(mid);
    const secondHalf = scored.slice(0, mid);

    const avg1 =
      firstHalf.reduce((a, r) => a + (r.score ?? 0), 0) / firstHalf.length;

    const avg2 =
      secondHalf.reduce((a, r) => a + (r.score ?? 0), 0) / secondHalf.length;

    if (avg2 - avg1 > 5) trend = "up";
    else if (avg1 - avg2 > 5) trend = "down";
    else trend = "stable";
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Performance Timeline</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track how your content evolves over time.
          </p>
        </div>

        {plan !== "free" && (
          <UsageIndicator
            usage={{
              plan,
              usedMinutesThisMonth: 60,
            }}
          />
        )}
        <div className="mt-3 sm:mt-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
          >
            <option value="newest">Newest</option>
            <option value="best">Best score</option>
            <option value="worst">Lowest score</option>
          </select>
        </div>
      </div>
      {average !== null && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {/* Average */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Average score</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {average}
              </div>
            </div>

            {/* Best */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Best score</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">
                {best}
              </div>
            </div>

            {/* Lowest */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Lowest score</div>
              <div className="mt-1 text-2xl font-bold text-rose-400">
                {worst}
              </div>
            </div>

            {/* Trend */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Trend</div>
              <div
                className={`mt-1 text-2xl font-bold ${
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                      ? "text-rose-400"
                      : "text-zinc-300"
                }`}
              >
                {trend === "up"
                  ? "Improving ↑"
                  : trend === "down"
                    ? "Declining ↓"
                    : trend === "stable"
                      ? "Stable"
                      : "—"}
              </div>
            </div>
          </div>

          {chartData.length >= 2 && <ScoreChart data={chartData} />}
        </>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {enriched.length === 0 && (
          <p className="text-sm text-zinc-500">
            No analyses yet. Upload your first audio to get started.
          </p>
        )}

        {sorted.map((r) => (
          <Link
            key={r.id}
            href={`/report/${r.id}`}
            className="
              block rounded-2xl border border-white/10 bg-black/40 p-5
              hover:border-indigo-400/40 hover:bg-black/50 transition
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {r.originalName ?? "Untitled analysis"}
                </p>
                {r.summary && (
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {r.summary}
                  </p>
                )}
                {/* SCORE + DELTA */}
                <div className="flex items-center gap-3">
                  {r.score !== null && (
                    <span
                      className={`text-lg font-bold ${
                        r.score !== null && r.score >= 80
                          ? "text-emerald-400"
                          : r.score !== null && r.score < 60
                            ? "text-rose-400"
                            : "text-white"
                      }`}
                    >
                      {r.score}
                      {r.score !== null && r.score >= 85 && (
                        <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                          Viral candidate
                        </span>
                      )}
                    </span>
                  )}

                  {r.delta !== null && (
                    <span
                      className={`text-xs font-semibold ${
                        r.delta > 0
                          ? "text-emerald-400"
                          : r.delta < 0
                            ? "text-rose-400"
                            : "text-zinc-400"
                      }`}
                    >
                      {r.delta > 0
                        ? `↑ +${r.delta}`
                        : r.delta < 0
                          ? `↓ ${r.delta}`
                          : "—"}
                    </span>
                  )}
                </div>

                {/* META */}
                <p className="mt-3 text-xs text-zinc-400">
                  {new Date(r.createdAt).toLocaleString()}
                  {r.durationSec && <> · {Math.ceil(r.durationSec / 60)} min</>}
                </p>
              </div>

              <span className="text-xs text-indigo-400 font-semibold">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
