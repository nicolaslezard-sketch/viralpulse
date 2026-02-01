import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TikTok Viral Audio Analysis – Find Clips That Go Viral | ViralPulse",
  description:
    "Analyze TikTok audio with AI to discover viral hooks, high-retention moments and clip ideas. Upload audio and get instant TikTok-ready insights.",
  alternates: {
    canonical: "https://viralpulse.studio/tiktok-viral-audio-analysis",
  },
  openGraph: {
    title: "TikTok Viral Audio Analysis – Find Clips That Go Viral",
    description:
      "AI-powered TikTok audio analyzer that detects viral hooks, moments and content angles.",
    url: "https://viralpulse.studio/tiktok-viral-audio-analysis",
    siteName: "ViralPulse",
    type: "website",
  },
};

export default function TikTokViralAudioAnalysisPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      {/* HERO */}
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          TikTok Viral Audio Analysis
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          Upload your audio and let AI analyze what makes TikTok clips go viral
          — hooks, pacing, emotional spikes and scroll-stopping moments.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 text-base font-medium text-black transition hover:bg-zinc-200"
          >
            Analyze TikTok Audio
          </Link>

          <span className="text-sm text-zinc-400">
            Free analysis · No credit card
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-32 grid gap-12 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">1. Upload audio</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Upload a TikTok sound, voiceover or podcast clip.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">2. AI detects virality</h3>
          <p className="mt-3 text-sm text-zinc-300">
            ViralPulse analyzes hooks, timing, clarity and engagement triggers.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">3. Get TikTok-ready output</h3>
          <p className="mt-3 text-sm text-zinc-300">
            Receive clip ideas, titles, hooks and posting recommendations.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="mt-32 max-w-3xl text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">
          Why analyze TikTok audio for virality?
        </h2>

        <p className="mt-6">
          On TikTok, the difference between a viral clip and a dead post often
          comes down to the first few seconds. A strong hook, clear message and
          emotional timing are critical.
        </p>

        <p className="mt-4">
          ViralPulse helps creators understand why certain TikTok audios work,
          so you can replicate high-performing patterns instead of guessing.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 rounded-3xl border border-white/10 bg-linear-to-br from-pink-500/20 to-indigo-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold">
          Create TikTok clips that actually perform
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-200">
          Upload your audio and get AI-powered insights optimized for TikTok.
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
