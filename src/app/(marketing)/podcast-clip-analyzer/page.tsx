import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Podcast Clip Analyzer – Analyze Podcast Audio or Video | ViralPulse",
  description:
    "Upload podcast audio or video and get AI-powered transcript, hook analysis, rewrite ideas and short-form content insights from spoken content.",
  alternates: {
    canonical: "https://viralpulse.studio/podcast-clip-analyzer",
  },
  openGraph: {
    title: "Podcast Clip Analyzer – Analyze Podcast Audio or Video",
    description:
      "AI-powered podcast clip analyzer for spoken content. Upload podcast audio or video to get transcript, hook analysis and clip-ready insights.",
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
          Upload podcast audio or video and get AI-powered transcript, hook
          analysis, rewrite suggestions and clip-ready insights from spoken
          content.
        </p>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/8 px-5 py-4 text-left text-sm leading-relaxed text-amber-100">
          <span className="font-semibold text-amber-200">Important:</span> For
          video uploads, ViralPulse currently analyzes extracted audio and
          transcript. It works best for spoken podcast content, interviews,
          commentary and educational segments. Fully visual context is not
          interpreted yet.
        </div>

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
            Upload a podcast audio file, a recorded segment or a video version
            of your episode.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">
            2. We analyze spoken content
          </h3>
          <p className="mt-3 text-sm text-zinc-300">
            ViralPulse extracts audio when needed, builds a transcript and
            evaluates hook strength, clarity and short-form potential.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">3. Get clip-ready direction</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Receive transcript, rewrite suggestions and practical guidance for
            stronger short-form podcast clips.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why analyze podcast audio for short-form clips?
        </h2>

        <p className="mt-6">
          Manually finding strong podcast clip candidates takes time and usually
          relies too much on intuition. What sounds interesting inside a full
          episode does not always work as a standalone short-form piece.
        </p>

        <p className="mt-4">
          ViralPulse helps creators review spoken podcast content faster by
          turning audio or video into transcript, analysis and rewrite
          suggestions. That makes it easier to identify stronger hooks, clearer
          ideas and segments that may translate better into TikTok, Reels or
          YouTube Shorts.
        </p>

        <p className="mt-4">
          This workflow works especially well for interviews, commentary,
          educational podcasts, expert conversations and opinion-driven clips
          where what is being said carries most of the value.
        </p>

        {/* SOFT BLOG LINK */}
        <section className="mt-10 max-w-3xl">
          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-5">
            <p className="text-sm text-zinc-300">
              Want to understand how creators identify stronger podcast moments
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
        <h3 className="text-xl font-semibold">
          Analyze other creator workflows
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LinkCard
            title="TikTok Viral Audio Analysis"
            desc="Review hooks, clarity and spoken-content strength for TikTok-style clips."
            href="/tiktok-viral-audio-analysis"
          />

          <LinkCard
            title="YouTube Shorts Analyzer"
            desc="Improve spoken-content structure and hook strength for Shorts-style content."
            href="/youtube-shorts-virality-analyzer"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-indigo-500/20 to-purple-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Turn podcast episodes into stronger short-form content
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload podcast audio or video and get AI-powered transcript, rewrite
          suggestions and spoken-content insights before you clip and publish.
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
