"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-128 w-4xl -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-112 w-md rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/40" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="bg-linear-to-r from-indigo-300 via-indigo-400 to-violet-300 bg-clip-text text-lg font-bold tracking-tight text-transparent"
        >
          ViralPulse
        </Link>

        <Link
          href="/tools/hook-analyzer"
          className="rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/20"
        >
          Try script analyzer
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-8 px-6 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Free account · No credit card required
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Sign in to analyze, save and unlock your first full report.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
            ViralPulse helps creators improve hooks, spoken content, transcripts
            and rewrites before publishing.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            <Feature text="Free script hook analyzer" />
            <Feature text="Audio/video upload" />
            <Feature text="Viral score and report preview" />
            <Feature text="First full report unlocked" />
            <Feature text="Saved report history" />
            <Feature text="Upgrade only when needed" />
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-black/45 p-6 shadow-[0_20px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/15 text-2xl">
            ⚡
          </div>

          <h2 className="text-center text-2xl font-bold tracking-tight">
            Continue to ViralPulse
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-zinc-400">
            Use your free account to test the workflow and keep your analysis
            history in one place.
          </p>

          <div className="mt-7 space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99]"
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              <GitHubIcon className="h-5 w-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-200">
              Your first full report is unlocked for free.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              After that, you can keep using previews, unlock a single report,
              or upgrade to Creator for full reports every time.
            </p>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
            Your content stays private. ViralPulse never publishes your files.
          </p>
        </div>
      </section>
    </main>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
      ✓ {text}
    </div>
  );
}
