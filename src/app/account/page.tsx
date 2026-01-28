"use client";

import { useSession, signOut } from "next-auth/react";
import { useUserPlan } from "@/lib/useUserPlan";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { plan, usage, hasCard, isLoading } = useUserPlan();

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-white">
        <p className="text-sm text-zinc-400">Loading account…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-white">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-3 text-sm text-zinc-400">
          You need to be signed in to view this page.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition"
        >
          Go back
        </Link>
      </main>
    );
  }

  const { user } = session;

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-white">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Manage your plan, billing and session.
      </p>

      {/* ACCOUNT INFO */}
      <section className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Account</h2>

        <div className="mt-4 flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt="Avatar"
              className="h-12 w-12 rounded-full border border-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-white/10" />
          )}

          <div>
            <p className="text-sm font-medium text-white">
              {user.name ?? "User"}
            </p>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Signed in with {user.image ? "Google" : "provider"}
            </p>
          </div>
        </div>
      </section>

      {/* PLAN & USAGE */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Plan & usage</h2>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Current plan</p>
            <p className="text-lg font-semibold capitalize text-white">
              {isLoading ? "…" : plan}
            </p>

            {usage && (
              <p className="mt-1 text-sm text-zinc-500">
                {usage.plan === "free" ? (
                  <>
                    {usage.freeDailyRemaining} free analysis
                    {usage.freeDailyRemaining === 1 ? "" : "es"} remaining today
                  </>
                ) : (
                  <>
                    {usage.usedMinutesThisMonth} minutes used this month
                  </>
                )}
              </p>
            )}
          </div>

          <Link
            href="/#pricing"
            className="
              inline-flex
              rounded-xl
              bg-white px-4 py-2
              text-sm font-semibold text-black
              hover:bg-zinc-200
              transition
            "
          >
            {plan === "pro" ? "View plans" : "Manage plan"}
          </Link>
        </div>
      </section>

      {/* BILLING */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Billing</h2>

        <p className="mt-2 text-sm text-zinc-400">
          Your card is only used if you explicitly upgrade your plan.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {hasCard ? (
              <span className="text-emerald-400">✓ Card on file</span>
            ) : (
              <span className="text-zinc-400">No card added</span>
            )}
          </div>

          <Link
            href="/add-card"
            className="
              inline-flex
              rounded-xl
              border border-white/10
              bg-black/60 px-4 py-2
              text-sm font-semibold text-white
              hover:bg-black/80
              transition
            "
          >
            {hasCard ? "Update card" : "Add card"}
          </Link>
        </div>
      </section>

      {/* SECURITY */}
      <section className="mt-10 rounded-2xl border border-red-900/30 bg-red-950/30 p-6">
        <h2 className="text-lg font-semibold text-red-300">Security</h2>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="
            mt-4 inline-flex
            rounded-xl
            bg-red-600 px-4 py-2
            text-sm font-semibold text-white
            hover:bg-red-500
            transition
          "
        >
          Log out
        </button>
      </section>
    </main>
  );
}
