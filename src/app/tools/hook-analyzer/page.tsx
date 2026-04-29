import type { Metadata } from "next";
import Link from "next/link";
import HookAnalyzerClient from "./HookAnalyzerClient";

export const metadata: Metadata = {
  title: "Free Hook Analyzer for TikTok, Reels & Shorts",
  description:
    "Paste your video idea or script and get a hook score, rewrite, title ideas and platform-specific advice before you publish.",
};

export default function HookAnalyzerPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#05060a]" />
        <div className="absolute -top-40 left-1/2 h-128 w-4xl -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-112 w-md rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/40" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ViralPulse
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
          >
            Pricing
          </Link>

          <Link
            href="/#analyze"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Upload file
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 text-center md:pt-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Free script analysis · No upload needed
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Fix your hook before your video dies in the first 3 seconds.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Paste a video idea, intro or full script. ViralPulse scores the hook,
          explains why people may skip, and rewrites it for TikTok, Reels,
          Shorts, LinkedIn videos or podcast clips.
        </p>
      </section>

      <HookAnalyzerClient />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="Lower friction"
            text="No file upload, no waiting for transcription. Paste your idea and get feedback in seconds."
          />
          <InfoCard
            title="Better first 3 seconds"
            text="The tool focuses on the exact moment where short-form videos usually lose viewers."
          />
          <InfoCard
            title="Upgrade path"
            text="Use full audio and video analysis when you want transcripts, deeper strategy and history."
          />
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}
