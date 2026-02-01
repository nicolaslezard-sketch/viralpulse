import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "YouTube Shorts Virality Analyzer – Find High-Retention Clips | ViralPulse",
  description:
    "Analyze YouTube Shorts with AI to discover viral hooks, retention patterns and clip ideas. Upload audio and get actionable insights for Shorts.",
  alternates: {
    canonical: "https://viralpulse.studio/youtube-shorts-virality-analyzer",
  },
  openGraph: {
    title: "YouTube Shorts Virality Analyzer – Find High-Retention Clips",
    description:
      "AI-powered YouTube Shorts analyzer that detects viral hooks, pacing and retention triggers.",
    url: "https://viralpulse.studio/youtube-shorts-virality-analyzer",
    siteName: "ViralPulse",
    type: "website",
  },
};

export default function YouTubeShortsViralityAnalyzerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      {/* HERO */}
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          YouTube Shorts Virality Analyzer
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          Upload your audio and let AI analyze what makes YouTube Shorts retain
          viewers — hooks, pacing, clarity and viral moments.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 text-base font-medium text-black transition hover:bg-zinc-200"
          >
            Analyze a Short
          </Link>

          <span className="text-sm text-zinc-400">
            Free analysis · No credit card required
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-32 grid gap-12 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">1. Upload audio</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Upload narration, voiceover or a short-form clip audio.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">2. AI analyzes retention</h3>
          <p className="mt-3 text-sm text-zinc-300">
            ViralPulse detects where attention spikes, drops and stabilizes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">3. Optimize for Shorts</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Get clip ideas, hooks and recommendations tailored for YouTube
            Shorts.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why YouTube Shorts virality is different
        </h2>

        <p className="mt-6">
          YouTube Shorts favor sustained retention, clear value delivery and
          early engagement. Unlike other platforms, Shorts reward consistency
          and watch time over shock alone.
        </p>

        <p className="mt-4">
          ViralPulse helps creators understand why some Shorts keep viewers
          watching while others drop off, so you can improve performance with
          every upload.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-red-500/20 to-indigo-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Build Shorts with higher retention
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload your audio and get AI-powered insights optimized for YouTube
          Shorts.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-medium text-black transition hover:bg-zinc-200"
        >
          Start Free
        </Link>
      </section>
    </main>
  );
}
