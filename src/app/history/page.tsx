"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserPlan } from "@/lib/useUserPlan";
import UsageIndicator, {
  type UsageSnapshot,
} from "@/components/analysis/UsageIndicator";

type HistoryItem = {
  id: string;
  createdAt: string;
  durationSec?: number | null;
  originalFilename?: string | null;
};

export default function HistoryPage() {
  const { plan, isLoading } = useUserPlan();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [usage, setUsage] = useState<UsageSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     Load history
  ========================= */
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

  /* =========================
     Load usage
  ========================= */
  useEffect(() => {
    if (plan === "free") return;

    fetch("/api/usage")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load usage");
        return r.json();
      })
      .then(setUsage)
      .catch(() => {
        /* usage es informativo, no bloquea */
      });
  }, [plan]);

  /* =========================
     Loading
  ========================= */
  if (isLoading) {
    return <div className="py-24 text-center text-zinc-400">Loading…</div>;
  }

  /* =========================
     FREE PAYWALL
  ========================= */
  if (plan === "free") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-white">
        <h1 className="text-2xl font-semibold">Analysis history</h1>

        <p className="mt-3 text-zinc-400">
          Upgrade to save and access your past analyses.
        </p>

        <Link
          href="/#pricing"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Upgrade to unlock history
        </Link>
      </main>
    );
  }

  /* =========================
     PAID VIEW
  ========================= */
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-white">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Analysis history</h1>
          <p className="mt-1 text-sm text-zinc-400">
            All your previous analyses, saved and searchable.
          </p>
        </div>

        {usage && <UsageIndicator usage={usage} />}
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
              transition hover:border-indigo-400/40 hover:bg-black/50
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Analysis</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              {typeof r.durationSec === "number" && (
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
