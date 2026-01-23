"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HistoryItem = {
  id: string;
  status: "processing" | "done" | "error";
  durationSec: number;
  wasTrimmed: boolean;
  createdAt: string;
};

export default function HistoryClient() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then(async (res) => {
        if (!res.ok) throw new Error("PRO_ONLY");
        return res.json();
      })
      .then(setItems)
      .catch(() => setError("Upgrade to Pro to access your history"));
  }, []);

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold">Analysis history</h1>
        <p className="text-zinc-500">
          Your past analyses will appear here.
        </p>
        <a
          href="/pricing"
          className="inline-block px-4 py-2 bg-white text-black rounded"
        >
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Analysis history</h1>

      {items.length === 0 && (
        <p className="text-zinc-500">No analyses yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/report/${item.id}`}
            className="block rounded border border-zinc-800 p-4 hover:bg-zinc-900 transition"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <p className="font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-zinc-500 text-xs">
                  ⏱ {item.durationSec}s
                  {item.wasTrimmed && " · ✂ Trimmed"}
                </p>
              </div>

              <span className="text-xs text-zinc-400">
                {item.status === "done" && "✔ Done"}
                {item.status === "processing" && "⏳ Processing"}
                {item.status === "error" && "❌ Error"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
