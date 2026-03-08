import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import PricingSection from "@/components/PricingSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#05060a]" />
        <div className="absolute -top-40 left-1/2 h-128 w-4xl -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-112 w-md rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 h-136 w-136 rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/30" />
      </div>

      <Header />

      {/* MINI HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1 text-xs text-zinc-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Video + audio analysis for short-form creators
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
          Turn one upload into a{" "}
          <span className="block bg-linear-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
            viral playbook
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          Upload a video or audio file and get your score, transcript, rewrite
          and publishing strategy in minutes.
        </p>
      </section>

      {/* ANALYSIS CONSOLE = REAL HERO */}
      <section id="analyze" className="mx-auto max-w-6xl px-6 pb-18">
        <div className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl">
          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <div className="text-lg font-semibold">Analysis Console</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill>Free · 5 min / 80 MB</Pill>
              <Pill>Plus · 10 min · 120 min / month</Pill>
              <Pill glow>Pro · 20 min · 400 min / month</Pill>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left panel */}
            <div className="rounded-3xl border border-white/10 bg-black/25 p-8 md:p-10">
              <div className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                Upload once. Optimize before you post.
              </div>

              <h2 className="mt-6 text-4xl font-extrabold tracking-tight">
                Upload once. Leave with a publish-ready plan.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
                ViralPulse analyzes your video or audio, scores its viral
                potential, builds a transcript, generates rewrite suggestions
                and shows what to improve before you publish.
              </p>

              <ul className="mt-8 space-y-4">
                <Bullet>
                  <b>Viral score + instant read</b> to understand potential at a
                  glance
                </Bullet>
                <Bullet>
                  <b>Strategy insights + what to fix</b> before the content goes
                  live
                </Bullet>
                <Bullet>
                  <b>AI rewrite + transcript</b> for faster iteration and
                  editing
                </Bullet>
                <Bullet>
                  <b>History + analytics on paid plans</b> to track performance
                  over time
                </Bullet>
              </ul>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Best input for stronger analysis
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Use a segment with a strong opinion, a surprising reveal, a
                  before/after result, or a clear educational point. Mobile MP4
                  files usually upload faster than large desktop screen
                  recordings.
                </p>
              </div>
            </div>

            {/* Right panel */}
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5 md:p-6">
              <UploadBox />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="text-3xl font-semibold">What happens after upload</h2>
        <p className="mt-3 text-zinc-400">
          A simple workflow that turns one file into score, transcript, rewrite
          and strategy.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Step
            title="Upload"
            desc="Add a video or audio file and start analysis in one click."
          />
          <Step
            title="Transcript"
            desc="We turn speech into text so the full context can be understood."
          />
          <Step
            title="Analysis"
            desc="We score retention potential, structure, clarity and virality."
          />
          <Step
            title="Output"
            desc="You get strategy insights, rewrite suggestions and what to fix."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-semibold">
          What you get in every analysis
        </h2>
        <p className="mt-3 text-center text-zinc-400">
          A report built for creators who want clearer decisions before they
          publish.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          <FeatureCard
            title="Content understanding"
            items={[
              "Summary + viral reason",
              "Predicted longevity",
              "Audience fit + clarity signals",
            ]}
          />
          <FeatureCard
            title="Hooks & rewrite"
            items={[
              "AI rewrite preview",
              "Hook improvement ideas",
              "Title ideas",
              "Stronger framing",
            ]}
          />
          <FeatureCard
            title="Transcript & editing"
            items={[
              "Full transcript on paid plans",
              "Faster editing workflow",
              "Clearer review before posting",
            ]}
          />
          <FeatureCard
            title="Strategy & growth"
            items={[
              "What to fix",
              "Distribution strategy",
              "Performance analytics on Pro",
              "History across analyses",
            ]}
          />
        </div>
      </section>

      {/* ANALYZE BY FORMAT */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-semibold">
          Analyze content by format
        </h2>
        <p className="mt-3 text-center text-zinc-400">
          ViralPulse adapts analysis to the format and platform you’re creating
          for.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <LinkCard
            title="Podcast Analyzer"
            desc="Find stronger moments, structure and clip opportunities in longer spoken content."
            href="/podcast-clip-analyzer"
          />

          <LinkCard
            title="TikTok Virality Analyzer"
            desc="Review short-form content for hook strength, retention and replay potential."
            href="/tiktok-viral-audio-analysis"
          />

          <LinkCard
            title="YouTube Shorts Analyzer"
            desc="Optimize punchy vertical content before publishing to Shorts."
            href="/youtube-shorts-virality-analyzer"
          />
        </div>
      </section>

      {/* PRICING */}
      <PricingSection />

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-zinc-500">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/terms" className="transition hover:text-white">
              Terms of Service
            </a>

            <a href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </a>

            <a href="/refund" className="transition hover:text-white">
              Refund Policy
            </a>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            © {new Date().getFullYear()} ViralPulse. All rights reserved.
          </p>

          <p className="mt-4 text-xs text-zinc-500">
            Support:{" "}
            <a
              href="mailto:support@viralpulse.studio"
              className="underline hover:text-white"
            >
              support@viralpulse.studio
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function Pill({
  children,
  glow,
}: {
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <span
      className={[
        "rounded-full border px-3 py-1 text-xs text-zinc-200",
        glow
          ? "border-violet-400/30 bg-violet-500/10"
          : "border-white/10 bg-black/30",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-left">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-zinc-400">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-base text-zinc-200">
      <span className="mt-2 h-2 w-2 flex-none rounded-full bg-indigo-400/80" />
      <span className="text-zinc-300">{children}</span>
    </li>
  );
}

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
      className="
        group relative overflow-hidden rounded-2xl
        border border-white/10
        bg-black/30
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-400/40
        hover:bg-black/40
        hover:shadow-[0_0_0_1px_rgba(99,102,241,0.15),0_20px_40px_-20px_rgba(99,102,241,0.4)]
      "
    >
      <div className="mb-4 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
        Format analyzer
      </div>

      <h3 className="text-lg font-semibold transition-colors group-hover:text-indigo-300">
        {title}
      </h3>

      <p className="mt-2 text-sm text-zinc-400">{desc}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">Optimized report</span>
        <span className="text-sm font-medium text-indigo-400 transition group-hover:translate-x-1">
          Analyze →
        </span>
      </div>
    </Link>
  );
}
