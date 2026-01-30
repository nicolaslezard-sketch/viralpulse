"use client";

import { useState } from "react";

type Plan = "plus" | "pro";

export default function UpgradeButton({
  plan,
  label,
  className,
  variant = "primary",
}: {
  plan: Plan;
  label: string;
  className?: string;
  /** primary = indigo CTA, dark = neutral black CTA */
  variant?: "primary" | "dark";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lemon/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const msg = await safeErrorMessage(res);
        throw new Error(msg || "Checkout failed");
      }

      const data = (await res.json()) as { url?: string };
      if (data?.url) window.location.href = data.url;
      else throw new Error("Missing checkout URL");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  const base =
    "w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "dark"
      ? "bg-black text-white hover:bg-zinc-900"
      : "bg-indigo-500 text-white hover:bg-indigo-400";

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${base} ${styles}`}
      >
        {loading ? "Redirecting…" : label}
      </button>

      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

async function safeErrorMessage(res: Response) {
  try {
    const data = (await res.json()) as { error?: string; message?: string };
    return data?.error || data?.message;
  } catch {
    try {
      return await res.text();
    } catch {
      return null;
    }
  }
}
