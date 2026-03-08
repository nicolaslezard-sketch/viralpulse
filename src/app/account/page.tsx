"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useUserPlan } from "@/lib/useUserPlan";
import { limitsByPlan } from "@/lib/limits";
import Link from "next/link";

type AccountUsageResponse = {
  plan: "free" | "plus" | "pro";
  limits: {
    maxSeconds: number;
    maxBytes: number;
  };
  usage: {
    usedMinutesThisMonth: number;
    monthlyLimit: number;
    monthlyRemaining: number;
    freeDailyLimit: number;
    freeUsedToday: number;
    freeRemainingToday: number;
    usageMonth: string | null;
  };
};

function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || "U").trim();
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getPlanLabel(plan: string) {
  if (plan === "free") return "Free";
  if (plan === "plus") return "Plus";
  return "Pro";
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { plan, isLoading, isPaid, isPlus } = useUserPlan();

  const [avatarFailed, setAvatarFailed] = useState(false);
  const [usage, setUsage] = useState<AccountUsageResponse | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [usageError, setUsageError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsage() {
      try {
        setUsageLoading(true);
        const res = await fetch("/api/account/usage", { cache: "no-store" });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load usage");
        }

        if (cancelled) return;
        setUsage(json);
        setUsageError(null);
      } catch (err) {
        if (cancelled) return;
        setUsageError(
          err instanceof Error ? err.message : "Failed to load usage",
        );
      } finally {
        if (!cancelled) setUsageLoading(false);
      }
    }

    if (status === "authenticated") {
      loadUsage();
    }

    return () => {
      cancelled = true;
    };
  }, [status]);

  async function handleDeleteAccount() {
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation: deleteConfirm,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to delete account");
      }

      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-5xl px-6 py-24 text-white">
        <p className="text-sm text-zinc-400">Loading account…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-24 text-white">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-3 text-sm text-zinc-400">
          You need to be signed in to view this page.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Go back
        </Link>
      </main>
    );
  }

  const { user } = session;
  const currentPlan = isLoading ? "free" : plan;
  const limits = usage?.limits ?? limitsByPlan[currentPlan];
  const maxMinutes = Math.round(limits.maxSeconds / 60);
  const maxMb = Math.round(limits.maxBytes / (1024 * 1024));

  const progressPct =
    !usage || !isPaid || usage.usage.monthlyLimit <= 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (usage.usage.usedMinutesThisMonth / usage.usage.monthlyLimit) * 100,
          ),
        );

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your plan, usage and session.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          ← Back to home
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Profile</h2>

        <div className="mt-5 flex items-center gap-4">
          {user.image && !avatarFailed ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image}
                alt={user.name ?? "Avatar"}
                className="h-14 w-14 rounded-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
              />
            </>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-200">
              {getInitials(user.name, user.email)}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">
              {user.name ?? "User"}
            </p>
            <p className="truncate text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Plan</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Your current access level and limits.
            </p>
          </div>

          <Link
            href="/#pricing"
            className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            {currentPlan === "free"
              ? "Compare plans"
              : isPlus
                ? "Upgrade to Pro"
                : "See plans"}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Current plan</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {getPlanLabel(currentPlan)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Max file duration</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {maxMinutes} min
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Max file size</div>
            <div className="mt-1 text-2xl font-bold text-white">{maxMb} MB</div>
          </div>
        </div>

        {usageLoading ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-400">
            Loading usage…
          </div>
        ) : usageError ? (
          <div className="mt-5 rounded-2xl border border-red-800/40 bg-red-950/30 p-5 text-sm text-red-300">
            {usageError}
          </div>
        ) : currentPlan === "free" ? (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Daily analyses</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {usage?.usage.freeDailyLimit ?? 3}/day
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Used today</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {usage?.usage.freeUsedToday ?? 0}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">Remaining today</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">
                {usage?.usage.freeRemainingToday ?? 0}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium text-white">
                  Monthly usage
                </div>
                <p className="mt-1 text-sm text-zinc-400">
                  {usage?.usage.usedMinutesThisMonth ?? 0} /{" "}
                  {usage?.usage.monthlyLimit ?? 0} min used this month
                </p>
              </div>

              <div className="text-sm font-semibold text-emerald-400">
                {usage?.usage.monthlyRemaining ?? 0} min remaining
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-400 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-medium text-white">
            Included in your plan
          </div>

          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>• Video and audio upload support</li>
            <li>• Analysis history saved in your account</li>
            <li>
              •{" "}
              {currentPlan === "free"
                ? "Preview access to reports"
                : "Full access to transcript, rewrite and deeper insights"}
            </li>
            <li>• Billing handled securely via Lemon Squeezy</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Billing & access</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Your plan controls report depth, transcript access, AI rewrite access
          and performance analytics. Paid billing is handled through Lemon
          Squeezy.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/#pricing"
            className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Compare plans
          </Link>

          <a
            href="mailto:support@viralpulse.studio"
            className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contact support
          </a>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-red-900/30 bg-red-950/30 p-6">
        <h2 className="text-lg font-semibold text-red-300">Security</h2>
        <p className="mt-2 text-sm text-red-200/80">
          Sign out of your current session on this device.
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Log out
        </button>
      </section>

      <section className="mt-8 rounded-2xl border border-red-900/30 bg-red-950/20 p-6">
        <h2 className="text-lg font-semibold text-red-300">Danger zone</h2>
        <p className="mt-2 max-w-2xl text-sm text-red-200/80">
          Deleting your account will permanently remove your profile, analysis
          history and usage records. This action cannot be undone.
        </p>

        <div className="mt-5 max-w-md space-y-3">
          <label className="block text-sm text-red-100">
            Type <span className="font-semibold">DELETE</span> to confirm
          </label>

          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-xl border border-red-900/40 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
          />

          {deleteError && (
            <div className="rounded-xl border border-red-800/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {deleteError}
            </div>
          )}

          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirm.trim() !== "DELETE"}
            className="inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteLoading
              ? "Deleting account..."
              : "Delete account permanently"}
          </button>
        </div>
      </section>
    </main>
  );
}
