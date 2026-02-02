import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Podcast Clip Analyzer – Find Viral Podcast Moments | ViralPulse",
  description:
    "Analyze podcast audio with AI to discover viral moments, hooks and clip ideas optimized for TikTok, Reels and YouTube Shorts.",
  alternates: {
    canonical: "https://viralpulse.studio/podcast-clip-analyzer",
  },
  openGraph: {
    title: "Podcast Clip Analyzer – Find Viral Podcast Moments",
    description:
      "AI-powered podcast clip analyzer that detects viral hooks, emotional peaks and high-retention moments.",
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
          Upload your podcast audio and let AI identify viral moments, hooks and
          clip ideas — optimized for TikTok, Reels and YouTube Shorts.
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
            Upload a full episode or a podcast audio segment.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">2. AI analyzes virality</h3>
          <p className="mt-3 text-sm text-zinc-300">
            ViralPulse detects hooks, emotional peaks and high-retention
            moments.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">3. Get clip-ready insights</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Receive timestamps, clip ideas and short-form recommendations.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why analyze podcast audio for viral clips?
        </h2>

        <p className="mt-6">
          Manually finding viral podcast moments takes hours and relies heavily
          on intuition. What sounds interesting doesn’t always perform well in
          short-form.
        </p>

        <p className="mt-4">
          ViralPulse analyzes podcast audio to surface moments with strong
          hooks, emotional impact and standalone clarity — the key signals
          short-form platforms reward.
        </p>
        {/* SOFT BLOG LINK */}
        <section className="mt-10 max-w-3xl">
          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-5">
            <p className="text-sm text-zinc-300">
              Want to understand how creators identify viral podcast moments
              before editing?
              <Link
                href="/blog/how-to-find-viral-podcast-clips"
                className="ml-1 font-medium text-indigo-400 underline hover:text-indigo-300"
              >
                Read the full guide →
              </Link>
            </p>
          </div>
        </section>
      </section>

      {/* INTERLINKING / CLUSTER */}
      <section className="mt-32 border-t border-white/10 pt-16">
        <h3 className="text-xl font-semibold">Analyze other content formats</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LinkCard
            title="TikTok Viral Audio Analysis"
            desc="Find viral hooks and high-retention TikTok moments."
            href="/tiktok-viral-audio-analysis"
          />

          <LinkCard
            title="YouTube Shorts Analyzer"
            desc="Detect high-performing hooks for YouTube Shorts."
            href="/youtube-shorts-virality-analyzer"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-indigo-500/20 to-purple-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Turn podcasts into viral short clips
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload your podcast audio and get AI-powered insights for short-form
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
