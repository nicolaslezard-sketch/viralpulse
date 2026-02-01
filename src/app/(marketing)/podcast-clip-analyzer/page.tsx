import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Podcast Clip Analyzer – Turn Podcasts Into Viral Clips | ViralPulse",
  description:
    "Analyze podcast episodes with AI and discover the best moments to turn into viral clips for TikTok, Reels and Shorts. Upload audio and get instant insights.",
  alternates: {
    canonical: "https://viralpulse.studio/podcast-clip-analyzer",
  },
  openGraph: {
    title: "Podcast Clip Analyzer – Turn Podcasts Into Viral Clips",
    description:
      "AI-powered podcast clip analyzer that finds viral moments, hooks and highlights for short-form content.",
    url: "https://viralpulse.studio/podcast-clip-analyzer",
    siteName: "ViralPulse",
    type: "website",
  },
};

export default function PodcastClipAnalyzerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 text-white">
      {/* HERO */}
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          Podcast Clip Analyzer
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          Upload your podcast audio and let AI find the most viral moments,
          hooks, highlights and clip ideas — optimized for TikTok, Reels and
          YouTube Shorts.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 text-base font-medium text-black transition hover:bg-zinc-200"
          >
            Analyze a Podcast
          </Link>

          <span className="text-sm text-zinc-400">
            Free analysis · No credit card required
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-32 grid gap-12 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">1. Upload your podcast</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Upload an episode or audio segment. No editing required.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">2. AI analyzes virality</h3>
          <p className="mt-3 text-sm text-zinc-300">
            ViralPulse detects hooks, emotional peaks, quotable moments and
            high-retention segments.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">3. Get clip-ready insights</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Receive clip ideas, titles, timestamps and platform-specific
            recommendations.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why use an AI podcast clip analyzer?
        </h2>

        <p className="mt-6">
          Creating viral podcast clips manually is time-consuming and highly
          subjective. An AI-powered podcast clip analyzer removes the guesswork
          by identifying moments that naturally capture attention, emotion and
          engagement.
        </p>

        <p className="mt-4">
          ViralPulse helps podcasters, creators and agencies turn long-form
          podcast content into short-form clips designed to perform on modern
          platforms.
        </p>
      </section>

      {/* INTERLINKING / CLUSTER */}
      <section className="mt-32 border-t border-white/10 pt-16">
        <h3 className="text-xl font-semibold">Analyze other content formats</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LinkCard
            title="TikTok Virality Analyzer"
            desc="Analyze short-form audio for TikTok retention."
            href="/tiktok-viral-audio-analysis"
          />

          <LinkCard
            title="YouTube Shorts Analyzer"
            desc="Find high-retention hooks for YouTube Shorts."
            href="/youtube-shorts-virality-analyzer"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-indigo-500/20 to-purple-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Turn your podcast into viral clips
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload your audio and get instant AI-powered insights for short-form
          content.
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

/* ---------- UI helper ---------- */

function LinkCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-indigo-400/40 hover:bg-black/40"
    >
      <h4 className="text-lg font-semibold transition group-hover:text-indigo-300">
        {title}
      </h4>
      <p className="mt-2 text-sm text-zinc-400">{desc}</p>
      <div className="mt-4 text-sm text-indigo-400 opacity-0 transition group-hover:opacity-100">
        Explore →
      </div>
    </Link>
  );
}
