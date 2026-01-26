import UploadBox from "@/components/UploadBox";
import GoProButton from "@/components/GoProButton";
import Header from "@/components/Header";


export default function HomePage() {
  return (
    <main className="min-h-screen text-white selection:bg-indigo-500/30">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#05060a]" />
        {/* soft gradients */}
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[620px] w-[620px] rounded-full bg-sky-500/10 blur-[130px]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
      </div>

      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Audio → viral report in minutes
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Make your content go viral
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
              before you post it
            </span>
          </h1>

          <p className="mt-5 text-base text-zinc-400 md:text-lg">
            Upload an audio or podcast and get a viral-ready report: hooks, titles, clip ideas,
            key moments and platform strategy.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#analyze"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200 sm:w-auto"
            >
              Analyze an audio
            </a>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-semibold text-white hover:border-white/20 sm:w-auto"
            >
              See what you get
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <MiniValue title="Instant clarity" desc="Understand what works and why, fast." />
            <MiniValue title="Clip-first output" desc="Find the best moments for Shorts/Reels." />
            <MiniValue title="Better hooks" desc="Scroll-stopping hooks and titles every time." />
          </div>
        </div>
      </section>

      {/* ANALYSIS CONSOLE */}
      <section id="analyze" className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="relative">
          {/* subtle glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-sky-500/10 blur-2xl" />

          <div className="rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            {/* app chrome */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="ml-2 text-sm font-semibold text-white/90">
                  Analysis Console
                </span>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  Free: ≤ 3 min
                </span>
                <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                  Pro: ≤ 20 min + transcript
                </span>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Upload once. Get a viral playbook.
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    We detect the best moments, generate hooks and titles, and output a report you can copy
                    into your next post.
                  </p>

                  <div className="mt-5 space-y-3">
                    <Bullet>5-point summary + viral reason</Bullet>
                    <Bullet>Key moment + clip ideas</Bullet>
                    <Bullet>Hooks, titles, remix angles</Bullet>
                    <Bullet>Platform strategy + what to fix</Bullet>
                  </div>

                  <p className="mt-6 text-xs text-zinc-500">
                    Tip: try a segment where you explain a strong opinion or a surprising result.
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-4 md:p-5">
                    <UploadBox />
                  </div>
                  <p className="mt-3 text-center text-xs text-zinc-500 sm:hidden">
                    Free: up to 3 minutes • Pro: up to 20 minutes + transcript
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* trust strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <Stat k="18" label="Insights per report" />
            <Stat k="~2–4m" label="Typical processing" />
            <Stat k="10" label="Hook ideas" />
            <Stat k="10" label="Clip ideas" />
          </div>
        </div>
      </section>

   {/* WHAT HAPPENS */}
<section className="mx-auto max-w-6xl px-6 py-14 md:py-16">
  <div className="mx-auto max-w-2xl text-center">
    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
      What happens next
    </h2>
    <p className="mt-3 text-zinc-400">
      A simple flow that turns raw audio into publish-ready outputs.
    </p>
  </div>

  <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
    <Step number="01" title="Transcription">
      We convert your audio to clean text to understand context.
    </Step>

    <Step number="02" title="Analysis">
      We detect patterns: tension, novelty, clarity, pacing.
    </Step>

    <Step number="03" title="Generation">
      Hooks, titles, clips, angles — ready to copy.
    </Step>

    <Step number="04" title="Publish">
      Pick the best moment and post with confidence.
    </Step>
  </div>
</section>



      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What you get in every analysis
          </h2>
          <p className="mt-3 text-zinc-400">
            One upload. One report. Clear outputs for creators who want results.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <FeatureCard
            title="Content understanding"
            items={[
              "5-point content summary",
              "Virality reason",
              "Key moment (early/mid/late)",
              "Virality score (1–10)",
            ]}
          />

          <FeatureCard
            title="Hooks & angles"
            items={[
              "10 scroll-stopping hooks",
              "10 title ideas",
              "Angle variations",
              "Reaction script",
            ]}
          />

          <FeatureCard
            title="Clips & reuse"
            items={[
              "10 clip ideas",
              "Remix & reuse ideas",
              "Meme templates",
              "Format classification",
            ]}
          />

          <FeatureCard
            title="Strategy & growth"
            items={[
              "Platform strategy",
              "Target audience fit",
              "What to fix",
              "Replication framework",
            ]}
          />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Free vs Pro
          </h2>
          <p className="mt-3 text-zinc-400">
            Start free. Upgrade when you want longer audio and faster workflow.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Plan title="Free" variant="free">
            <ul className="space-y-2">
              <li>• 1 analysis / day</li>
              <li>• Up to 3 minutes</li>
              <li>• Viral report (18 insights)</li>
            </ul>
          </Plan>

          <Plan title="Pro" variant="pro">
            <ul className="space-y-2">
              <li>• Unlimited analysis</li>
              <li>• Up to 20 minutes</li>
              <li>• Full transcript</li>
              <li>• Full viral report</li>
              <li>• Priority processing</li>
              <li>• History & copy tools</li>
            </ul>
          </Plan>
        </div>

        <div className="mt-8 text-center">
          <a
            href="#analyze"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Try Free Analysis
          </a>
          <p className="mt-3 text-xs text-zinc-500">
            Preview the full workflow before going Pro.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-6 text-center backdrop-blur">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} ViralPulse — audio insights for creators.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* -----------------------
   Reusable UI
------------------------ */

function MiniValue({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-1 text-sm text-zinc-400">{desc}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-zinc-300">
      <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-indigo-400/90" />
      <span className="text-zinc-300">{children}</span>
    </div>
  );
}

function Stat({ k, label }: { k: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-center backdrop-blur">
      <div className="text-lg font-semibold text-white/90">{k}</div>
      <div className="mt-1 text-xs text-zinc-500">{label}</div>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        group relative
        rounded-2xl
        border border-white/12
        bg-black/35
        backdrop-blur
        p-5 md:p-6
        transition
        hover:border-white/22
        hover:bg-black/45
        hover:shadow-[0_0_55px_rgba(99,102,241,0.16)]
      "
    >
      <div className="text-xs text-zinc-500">{number}</div>

      <h3 className="mt-3 text-base font-semibold text-white/90">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{children}</p>
    </div>
  );
}



function FeatureCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      className="
        group relative
        rounded-2xl
        border border-white/10
        bg-black/30
        p-6
        backdrop-blur
        transition
        hover:border-white/20
        hover:bg-black/40
        hover:shadow-[0_0_55px_rgba(99,102,241,0.16)]
      "
    >
      <h3 className="font-semibold text-white/90">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-zinc-400">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-white/25" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Plan({
  title,
  children,
  variant = "free",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "free" | "pro";
}) {
  const isPro = variant === "pro";

  async function handleGoPro() {
    const res = await fetch("/api/stripe/setup-checkout", {
      method: "POST",
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
  <div
    className={[
      "relative rounded-2xl p-7 md:p-8 backdrop-blur transition",
      "border",
      isPro
        ? "border-indigo-400/25 bg-gradient-to-b from-indigo-500/12 to-black/30 shadow-[0_0_70px_rgba(99,102,241,0.20)]"
        : "border-white/10 bg-black/30 hover:border-white/20",
    ].join(" ")}
  >
    {isPro && (
      <div className="absolute right-4 top-4 rounded-full border border-indigo-400/25 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
        Recommended
      </div>
    )}

    <h3 className="text-lg font-semibold text-white/90">{title}</h3>
    <div className="mt-4 text-sm text-zinc-300">{children}</div>

    <div className="mt-7">
      {isPro ? (
        <GoProButton />
      ) : (
        <a
          href="#analyze"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
        >
          Start Free
        </a>
      )}

      <p className="mt-3 text-xs text-zinc-500">
        {isPro
          ? "Best for weekly creators."
          : "Card required to prevent abuse. We won’t charge unless you upgrade."}
      </p>
    </div>
  </div>
);

}
