import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "TikTok Viral Audio Analysis – Analyze Spoken Content for TikTok | ViralPulse",
  description:
    "Upload audio or video and get AI-powered transcript, hook analysis, rewrite ideas and spoken-content insights for TikTok-style clips.",
  alternates: {
    canonical: "https://viralpulse.studio/tiktok-viral-audio-analysis",
  },
  openGraph: {
    title: "TikTok Viral Audio Analysis – Analyze Spoken Content for TikTok",
    description:
      "AI-powered TikTok spoken-content analyzer for hooks, clarity, rewrites and stronger short-form ideas from audio or video.",
    url: "https://viralpulse.studio/tiktok-viral-audio-analysis",
    siteName: "ViralPulse",
    type: "website",
  },
};

export default function TikTokViralAudioAnalysisPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 text-white">
      {/* HERO */}
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          TikTok Viral Audio Analysis
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          Upload audio or video and get AI-powered transcript, hook analysis,
          rewrite suggestions and spoken-content insights for TikTok-style
          content.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 text-base font-medium text-black transition hover:bg-zinc-200"
          >
            Analyze TikTok Content
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
            Upload a voiceover, spoken clip, short-form segment or video with
            clear spoken content.
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
          <h3 className="text-lg font-semibold">3. Improve before you post</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Get transcript, rewrite suggestions and practical direction for
            stronger TikTok-style short-form content.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why analyze TikTok spoken content before posting?
        </h2>

        <p className="mt-6">
          On TikTok, the first seconds matter. A strong spoken hook, a clear
          point and sharp delivery can make the difference between a clip that
          gets ignored and one that holds attention.
        </p>

        <p className="mt-4">
          ViralPulse helps creators review spoken content faster by turning
          audio or video into transcript, analysis and rewrite suggestions. That
          makes it easier to pressure-test hooks, tighten the message and
          improve short-form ideas before publishing.
        </p>

        <p className="mt-4">
          This is especially useful for talking-head videos, commentary clips,
          educational TikToks, voiceovers and creator content where what is
          being said drives most of the performance.
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
            title="YouTube Shorts Analyzer"
            desc="Improve spoken-content hooks and structure for Shorts-style videos."
            href="/youtube-shorts-virality-analyzer"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-pink-500/20 to-indigo-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Build stronger TikTok-style content before you post
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload audio or video and get AI-powered transcript, rewrite
          suggestions and spoken-content insights for short-form creation.
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
