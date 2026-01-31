"use client";

import { useEffect, useState } from "react";
import { useUserPlan } from "@/lib/useUserPlan";
import Link from "next/link";
import UsageIndicator from "@/components/analysis/UsageIndicator";

type HistoryItem = {
  id: string;
  createdAt: string;
  durationSec?: number | null;
};

export default function HistoryPage() {
  const { plan, isLoading } = useUserPlan();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <div className="py-24 text-center text-zinc-400">Loading…</div>;
  }

  // 🔒 FREE PAYWALL
  if (plan === "free") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-white">
        <h1 className="text-2xl font-semibold">Analysis history</h1>
        <p className="mt-3 text-zinc-400">
          Upgrade to save and access your past analyses.
        </p>

        <Link
          href="/#pricing"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition"
        >
          Upgrade to unlock history
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Analysis history</h1>
          <p className="mt-1 text-sm text-zinc-400">
            All your previous analyses, saved and searchable.
          </p>
        </div>

        <UsageIndicator
          usage={{
            plan,
            usedMinutesThisMonth: 60, // luego lo traés real
          }}
        />
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-zinc-500">
            No analyses yet. Upload your first audio to get started.
          </p>
        )}

        {items.map((r) => (
          <Link
            key={r.id}
            href={`/report/${r.id}`}
            className="
              block rounded-2xl border border-white/10 bg-black/40 p-4
              hover:border-indigo-400/40 hover:bg-black/50 transition
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Analysis</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              {r.durationSec && (
                <span className="text-xs text-zinc-400">
                  {Math.ceil(r.durationSec / 60)} min
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
