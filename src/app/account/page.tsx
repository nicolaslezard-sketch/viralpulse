"use client";

import { useSession, signOut } from "next-auth/react";
import { useUserPlan } from "@/lib/useUserPlan";
import { limitsByPlan } from "@/lib/limits";
import Link from "next/link";
import Image from "next/image";

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
  const { plan, isLoading } = useUserPlan();

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24 text-white">
        <p className="text-sm text-zinc-400">Loading account…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24 text-white">
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
  const limits = limitsByPlan[currentPlan];
  const maxMinutes = Math.round(limits.maxSeconds / 60);
  const maxMb = Math.round(limits.maxBytes / (1024 * 1024));

  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your plan, access and session.
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
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Avatar"}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
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
            {currentPlan === "free" ? "Compare plans" : "See plans"}
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

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-medium text-white">
            Included in your plan
          </div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>• Video and audio upload support</li>
            <li>• Analysis history saved in your account</li>
            <li>• Access level based on your current plan</li>
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

      <section className="mt-10 rounded-2xl border border-red-900/30 bg-red-950/30 p-6">
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
    </main>
  );
}
