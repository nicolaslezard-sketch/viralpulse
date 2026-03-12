import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Link from "next/link";

const TIMELINE_POINTS = [
  76, 74, 79, 81, 75, 82, 83, 81, 83, 79, 76, 74, 76, 78,
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#05060a]" />
        <div className="absolute -top-40 left-1/2 h-128 w-4xl -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-112 w-md rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 h-136 w-136 rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/30" />
      </div>

      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-12 text-center md:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1 text-xs text-zinc-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Video + audio analysis for short-form creators{" "}
        </div>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Know if your content works{" "}
          <span className="block bg-linear-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
            before you publish it
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-base text-zinc-400 sm:text-lg">
          <p className="mx-auto mt-5 max-w-3xl text-base text-zinc-400 sm:text-lg">
            Upload a video or audio file and get score, transcript, rewrite and
            publishing strategy in minutes.
          </p>
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/#analyze"
            className="inline-flex min-w-45 items-center justify-center rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Analyze now
          </Link>

          <Link
            href="/#pricing"
            className="inline-flex min-w-45 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See plans
          </Link>
        </div>
      </section>

      {/* ANALYSIS CONSOLE */}
      <section id="analyze" className="mx-auto max-w-6xl px-6 pb-16 md:pb-18">
        <div className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <div className="text-base font-semibold md:text-lg">
                Analysis Console
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Pill tone="free">Free · 5 min / 80 MB</Pill>
              <Pill tone="plus">Plus · 10 min · 120 min / month</Pill>
              <Pill tone="pro">Pro · 20 min · 400 min / month</Pill>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-4 md:gap-6 md:p-6 lg:grid-cols-[0.95fr_1.05fr]">
            {/* MOBILE FIRST: UPLOAD FIRST */}
            <div className="order-1 rounded-3xl border border-indigo-400/20 bg-white/4 p-4 shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_30px_80px_-40px_rgba(99,102,241,0.5)] md:p-6 lg:order-2">
              <UploadBox />
            </div>

            <div className="order-2 rounded-3xl border border-white/10 bg-black/25 p-6 md:p-8 lg:order-1 lg:p-10">
              <div className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                Upload once. Optimize before you post.
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:mt-6 md:text-4xl">
                Upload once. Leave with a publish-ready plan.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
                ViralPulse analyzes spoken content from your audio or video,
                scores viral potential, builds a transcript, generates rewrite
                suggestions and shows what to improve before you publish.
              </p>

              <ul className="mt-6 space-y-3 md:mt-8 md:space-y-4">
                <Bullet>
                  <b>Viral score + instant read</b> to understand potential fast
                </Bullet>
                <Bullet>
                  <b>Strategy insights + what to fix</b> before content goes
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

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:mt-8 md:p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 md:text-xs">
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
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
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
            desc="For video uploads, we extract audio and turn speech into text for analysis."
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

      {/* PERFORMANCE TIMELINE */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[28px] border border-white/10 bg-black/30 p-5 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                Pro feature
              </div>

              <h2 className="mt-4 text-3xl font-semibold">
                Performance Timeline
              </h2>

              <p className="mt-3 text-zinc-400">
                Track score evolution across analyses, spot trends over time and
                see whether your content is actually improving.
              </p>
            </div>

            <Link
              href="/history"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Open performance timeline
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat title="Tracked analyses" value="17" />
            <MiniStat title="Average score" value="79" />
            <MiniStat
              title="Best score"
              value="83.4"
              accent="text-emerald-400"
            />
            <MiniStat title="Trend" value="Stable" />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-300">
                  Score evolution
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Completed analyses shown from oldest to newest.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-3 bg-indigo-400" />
                  <span>Content score</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-3 border-t border-dashed border-emerald-400" />
                  <span>Threshold (80)</span>
                </div>
              </div>
            </div>

            <div className="relative h-48 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-indigo-500/10 to-transparent md:h-56">
              <div className="absolute inset-x-0 top-[34%] border-t border-dashed border-emerald-400/60" />

              <div className="absolute inset-x-3 bottom-8 top-6 md:inset-x-6 md:bottom-6 md:top-8">
                {/* area glow */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="timelineArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(129,140,248,0.30)" />
                      <stop offset="100%" stopColor="rgba(129,140,248,0.02)" />
                    </linearGradient>
                  </defs>

                  <path
                    d={buildAreaPath(TIMELINE_POINTS)}
                    fill="url(#timelineArea)"
                    stroke="none"
                  />
                  <path
                    d={buildLinePath(TIMELINE_POINTS)}
                    fill="none"
                    stroke="rgba(165,180,252,0.95)"
                    strokeWidth="1.8"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="absolute inset-0 flex items-end justify-between">
                  {TIMELINE_POINTS.map((score, i, arr) => {
                    const y = scoreToPercent(score);
                    const isLast = i === arr.length - 1;

                    return (
                      <div
                        key={i}
                        className="relative flex h-full flex-1 items-end justify-center"
                      >
                        <div
                          className="absolute flex flex-col items-center"
                          style={{ bottom: `calc(${y}% - 6px)` }}
                        >
                          {isLast && (
                            <div className="mb-2 text-[10px] font-medium text-indigo-200">
                              Latest
                            </div>
                          )}

                          <div
                            className={[
                              "rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(129,140,248,0.85)]",
                              isLast
                                ? "h-3 w-3 border-2 border-white"
                                : "h-2 w-2 border border-indigo-100/80",
                            ].join(" ")}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-indigo-400/12 to-transparent" />
            </div>
          </div>
        </div>
      </section>

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

      <PricingSection />
      <FAQSection />

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

function scoreToPercent(score: number) {
  const min = 60;
  const max = 90;
  const normalized = ((score - min) / (max - min)) * 100;
  return Math.max(8, Math.min(88, normalized));
}

function buildLinePath(points: number[]) {
  if (points.length === 0) return "";

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - scoreToPercent(point);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(points: number[]) {
  if (points.length === 0) return "";

  const line = buildLinePath(points);
  return `${line} L 100 100 L 0 100 Z`;
}

function Pill({
  children,
  tone = "free",
}: {
  children: React.ReactNode;
  tone?: "free" | "plus" | "pro";
}) {
  const styles =
    tone === "free"
      ? "border-white/10 bg-black/30 text-zinc-300"
      : tone === "plus"
        ? "border-indigo-400/25 bg-indigo-500/10 text-indigo-200"
        : "border-violet-400/30 bg-violet-500/12 text-violet-100";

  return (
    <span
      className={`rounded-full border px-4 py-1.5 text-sm font-medium ${styles}`}
    >
      {children}
    </span>
  );
}

function MiniStat({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs text-zinc-400">{title}</div>
      <div className={`mt-1 text-2xl font-bold text-white ${accent ?? ""}`}>
        {value}
      </div>
    </div>
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
        border border-white/10 bg-black/30 p-6
        transition-all duration-300
        hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-black/40
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
