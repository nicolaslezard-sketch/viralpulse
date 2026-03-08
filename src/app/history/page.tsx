"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUserPlan } from "@/lib/useUserPlan";
import type { FullReport } from "@/lib/report/types";
import ScoreChart from "@/components/history/ScoreChart";
import UsageIndicator from "@/components/analysis/UsageIndicator";

type ReportStatus =
  | "queued"
  | "extracting_audio"
  | "transcribing"
  | "analyzing"
  | "done"
  | "error"
  | string;

type HistoryItem = {
  id: string;
  status: ReportStatus;
  createdAt: string;
  durationSec?: number | null;
  originalName?: string | null;
  viralScore?: number | null;
  reportFull?: FullReport | null;
  reportFree?: FullReport | null;
};

type SortOption = "newest" | "best" | "worst";
type RangeOption = "30d" | "90d" | "all";

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "queued":
      return { text: "Queued", tone: "text-indigo-300" };
    case "extracting_audio":
      return { text: "Extracting audio", tone: "text-indigo-300" };
    case "transcribing":
      return { text: "Transcribing", tone: "text-indigo-300" };
    case "analyzing":
      return { text: "Analyzing", tone: "text-indigo-300" };
    case "done":
      return { text: "Open →", tone: "text-emerald-400" };
    case "error":
      return { text: "Failed", tone: "text-rose-400" };
    default:
      return { text: "Processing", tone: "text-indigo-300" };
  }
}

function getSummary(report: FullReport | null) {
  const summarySection = report?.sections?.["SUMMARY"];
  return (
    summarySection?.content
      ?.split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean)[0] ?? ""
  );
}

function isWithinRange(dateIso: string, range: RangeOption) {
  if (range === "all") return true;

  const now = Date.now();
  const createdAt = new Date(dateIso).getTime();
  const diffMs = now - createdAt;

  const days = range === "30d" ? 30 : 90;
  return diffMs <= days * 24 * 60 * 60 * 1000;
}

export default function HistoryPage() {
  const { plan } = useUserPlan();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [range, setRange] = useState<RangeOption>("30d");

  useEffect(() => {
    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load history");
        return r.json();
      })
      .then((d) => setItems(d.reports))
      .catch((e) => setError(e.message));
  }, []);

  const enriched = useMemo(() => {
    return items.map((item) => {
      const report = item.reportFull ?? item.reportFree ?? null;
      const score = item.status === "done" ? (item.viralScore ?? null) : null;

      return {
        ...item,
        score,
        summary: getSummary(report),
      };
    });
  }, [items]);

  const doneChronological = useMemo(() => {
    return [...enriched]
      .filter((r) => r.status === "done" && r.score !== null)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [enriched]);

  const doneChronologicalInRange = useMemo(() => {
    return doneChronological.filter((r) => isWithinRange(r.createdAt, range));
  }, [doneChronological, range]);

  const scoredWithDelta = useMemo(() => {
    return doneChronological.map((r, index, arr) => {
      const prev = index > 0 ? arr[index - 1] : null;
      const delta =
        prev && prev.score !== null && r.score !== null
          ? Number((r.score - prev.score).toFixed(1))
          : null;

      return {
        ...r,
        delta,
      };
    });
  }, [doneChronological]);

  const deltaMap = useMemo(() => {
    return new Map(scoredWithDelta.map((r) => [r.id, r.delta]));
  }, [scoredWithDelta]);

  const enrichedWithDelta = useMemo(() => {
    return enriched.map((r) => ({
      ...r,
      delta: deltaMap.get(r.id) ?? null,
    }));
  }, [enriched, deltaMap]);

  const sorted = useMemo(() => {
    const copy = [...enrichedWithDelta];

    if (sort === "best") {
      copy.sort((a, b) => {
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return b.score - a.score;
      });
      return copy;
    }

    if (sort === "worst") {
      copy.sort((a, b) => {
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return a.score - b.score;
      });
      return copy;
    }

    copy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return copy;
  }, [enrichedWithDelta, sort]);

  const chartData = useMemo(() => {
    return doneChronologicalInRange.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      dateLabel: new Date(r.createdAt).toLocaleString(),
      shortDateLabel: new Date(r.createdAt).toLocaleDateString(),
      score: r.score as number,
      name: r.originalName ?? "Untitled",
    }));
  }, [doneChronologicalInRange]);

  const trackedCount = doneChronologicalInRange.length;

  const average =
    doneChronologicalInRange.length > 0
      ? Math.round(
          doneChronologicalInRange.reduce(
            (acc, r) => acc + (r.score as number),
            0,
          ) / doneChronologicalInRange.length,
        )
      : null;

  const best =
    doneChronologicalInRange.length > 0
      ? Math.max(...doneChronologicalInRange.map((r) => r.score as number))
      : null;

  const worst =
    doneChronologicalInRange.length > 0
      ? Math.min(...doneChronologicalInRange.map((r) => r.score as number))
      : null;

  let trend: "up" | "down" | "stable" | null = null;

  if (doneChronologicalInRange.length >= 4) {
    const mid = Math.floor(doneChronologicalInRange.length / 2);
    const firstHalf = doneChronologicalInRange.slice(0, mid);
    const secondHalf = doneChronologicalInRange.slice(mid);

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

        <div className="mt-3 flex flex-wrap gap-3 sm:mt-0">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeOption)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <option value="newest">Newest</option>
            <option value="best">Best score</option>
            <option value="worst">Lowest score</option>
          </select>
        </div>
      </div>

      {average !== null && plan !== "free" && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Tracked analyses</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {trackedCount}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Average score</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {average}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Best score</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">
                {best}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Lowest score</div>
              <div className="mt-1 text-2xl font-bold text-rose-400">
                {worst}
              </div>
            </div>

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

      {plan === "free" && (
        <div className="mt-8 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6 text-center">
          <p className="text-sm font-medium text-indigo-200">
            🔒 Unlock performance analytics
          </p>

          <p className="mt-2 text-xs text-indigo-200/70">
            Track score evolution, long-term trends and what is improving over
            time.
          </p>

          <Link
            href="/pricing"
            className="mt-4 inline-block rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {enrichedWithDelta.length === 0 && (
          <p className="text-sm text-zinc-500">
            No analyses yet. Upload your first file to get started.
          </p>
        )}

        {sorted.map((r) => {
          const statusUi = getStatusLabel(r.status);

          return (
            <Link
              key={r.id}
              href={`/report/${r.id}`}
              className="
                block rounded-2xl border border-white/10 bg-black/40 p-5
                transition hover:border-indigo-400/40 hover:bg-black/50
              "
            >
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      {r.originalName ?? "Untitled analysis"}
                    </p>

                    <span
                      className={`rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold ${statusUi.tone}`}
                    >
                      {statusUi.text.replace(" →", "")}
                    </span>
                  </div>

                  {r.summary && r.status === "done" && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                      {r.summary}
                    </p>
                  )}

                  {plan === "free" && r.status === "done" && (
                    <div className="mt-2 space-y-1 text-xs text-zinc-500">
                      <div>🔒 Full report</div>
                      <div>🔒 Strategy insights</div>
                      <div>🔒 AI Rewrite</div>
                      <div>🔒 Full transcript</div>
                      <div>🔒 Performance analytics</div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    {r.score !== null && (
                      <span
                        className={`text-lg font-bold ${
                          r.score >= 80
                            ? "text-emerald-400"
                            : r.score < 60
                              ? "text-rose-400"
                              : "text-white"
                        }`}
                      >
                        {r.score}
                        {r.score >= 85 && (
                          <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
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

                  <p className="mt-3 text-xs text-zinc-400">
                    {new Date(r.createdAt).toLocaleString()}
                    {r.durationSec && (
                      <> · {Math.ceil(r.durationSec / 60)} min</>
                    )}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-xs font-semibold ${statusUi.tone}`}
                >
                  {statusUi.text}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
