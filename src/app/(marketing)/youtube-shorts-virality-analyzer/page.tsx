import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "YouTube Shorts Virality Analyzer – Analyze Spoken Content for Shorts | ViralPulse",
  description:
    "Upload audio or video and get AI-powered transcript, hook analysis, rewrite ideas and spoken-content insights for YouTube Shorts-style content.",
  alternates: {
    canonical: "https://viralpulse.studio/youtube-shorts-virality-analyzer",
  },
  openGraph: {
    title:
      "YouTube Shorts Virality Analyzer – Analyze Spoken Content for Shorts",
    description:
      "AI-powered YouTube Shorts spoken-content analyzer for hooks, clarity, rewrites and stronger short-form ideas from audio or video.",
    url: "https://viralpulse.studio/youtube-shorts-virality-analyzer",
    siteName: "ViralPulse",
    type: "website",
  },
};

export default function YouTubeShortsViralityAnalyzerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 text-white">
      {/* HERO */}
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          YouTube Shorts Virality Analyzer
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          Upload audio or video and get AI-powered transcript, hook analysis,
          rewrite suggestions and spoken-content insights for YouTube
          Shorts-style content.
        </p>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/8 px-5 py-4 text-left text-sm leading-relaxed text-amber-100">
          <span className="font-semibold text-amber-200">Important:</span> For
          video uploads, ViralPulse currently analyzes extracted audio and
          transcript. It works best for talking-head clips, voiceovers,
          commentary, educational content and other spoken-content formats.
          Fully visual context is not interpreted yet.
        </div>

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
          <h3 className="text-lg font-semibold">1. Upload audio or video</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Upload narration, voiceover, a spoken clip or a short-form video
            with clear spoken content.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">
            2. We analyze spoken content
          </h3>
          <p className="mt-3 text-sm text-zinc-300">
            ViralPulse extracts audio when needed, builds a transcript and
            reviews hook strength, clarity, structure and rewrite opportunities.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">3. Improve before posting</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Get transcript, rewrite suggestions and practical direction for
            stronger YouTube Shorts-style content.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why review spoken content before posting YouTube Shorts?
        </h2>

        <p className="mt-6">
          On YouTube Shorts, the opening matters. A clear spoken hook, stronger
          structure and faster value delivery can make a big difference in how a
          short-form idea lands.
        </p>

        <p className="mt-4">
          ViralPulse helps creators review spoken content faster by turning
          audio or video into transcript, analysis and rewrite suggestions. That
          makes it easier to tighten the message, sharpen hooks and improve
          short-form ideas before publishing.
        </p>

        <p className="mt-4">
          This workflow is especially useful for voiceovers, educational Shorts,
          commentary clips, talking-head videos and creator content where what
          is being said drives most of the result.
        </p>
      </section>

      {/* INTERLINKING / CLUSTER */}
      <section className="mt-32 border-t border-white/10 pt-16">
        <h3 className="text-xl font-semibold">
          Analyze other creator workflows
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LinkCard
            title="Podcast Clip Analyzer"
            desc="Review spoken podcast content for stronger short-form clip candidates."
            href="/podcast-clip-analyzer"
          />

          <LinkCard
            title="TikTok Viral Audio Analysis"
            desc="Improve hooks, clarity and spoken-content strength for TikTok-style clips."
            href="/tiktok-viral-audio-analysis"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-red-500/20 to-indigo-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Build stronger Shorts before you publish
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload audio or video and get AI-powered transcript, rewrite
          suggestions and spoken-content insights for YouTube Shorts-style
          creation.
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
