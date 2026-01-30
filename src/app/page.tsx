import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import PricingSection from "@/components/PricingSection";

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#05060a]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[620px] w-[620px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30" />
      </div>

      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1 text-xs text-zinc-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Audio → viral report in minutes
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
          Make your content go viral{" "}
          <span className="block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
            before you post it
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Upload an audio or podcast and get a viral-ready report: hooks, titles,
          clip ideas, key moments and platform strategy.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#analyze"
            className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Analyze an audio
          </a>
          <a
            href="#features"
            className="rounded-2xl border border-white/15 bg-black/30 px-6 py-3 text-sm font-semibold hover:border-white/30"
          >
            See what you get
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ValueCard title="Instant clarity" desc="Understand what works and why, fast." />
          <ValueCard title="Clip-first output" desc="Find the best moments for Shorts/Reels." />
          <ValueCard title="Better hooks" desc="Scroll-stopping hooks and titles every time." />
        </div>
      </section>

      {/* ANALYZE CONSOLE */}
      <section id="analyze" className="mx-auto max-w-6xl px-6 pb-16">
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
              <Pill>Free: ≤ 5 min</Pill>
              <Pill>Plus: ≤ 10 min · 120 min / month</Pill>
              <Pill glow>Pro: ≤ 20 min · 400 min / month</Pill>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            {/* Left */}
            <div className="rounded-3xl border border-white/10 bg-black/25 p-8">
              <h2 className="text-4xl font-extrabold tracking-tight">
                Upload once. Get a viral playbook.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
                We detect the best moments, generate hooks and titles, and
                output a report you can copy into your next post.
              </p>

              <ul className="mt-8 space-y-4 text-lg">
                <Bullet>5-point summary + viral reason</Bullet>
                <Bullet>Key moment + clip ideas</Bullet>
                <Bullet>Hooks, titles, remix angles</Bullet>
                <Bullet>Platform strategy + what to fix</Bullet>
              </ul>

              <p className="mt-8 text-sm text-zinc-500">
                Tip: try a segment where you explain a strong opinion or a
                surprising result.
              </p>
            </div>

            {/* Right */}
            <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
              <UploadBox />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="text-3xl font-semibold">What happens next</h2>
        <p className="mt-3 text-zinc-400">
          A simple flow that turns raw audio into publish-ready outputs.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Step title="Transcription" desc="We convert your audio to clean text to understand context." />
          <Step title="Analysis" desc="We detect patterns: tension, novelty, clarity, pacing." />
          <Step title="Generation" desc="Hooks, titles, clips, angles — ready to copy." />
          <Step title="Publish" desc="Pick the best moment and post with confidence." />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-semibold">
          What you get in every analysis
        </h2>
        <p className="mt-3 text-center text-zinc-400">
          One upload. One report. Clear outputs for creators who want results.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
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
      <PricingSection />

      <footer className="py-10 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} ViralPulse
      </footer>
    </main>
  );
}

/* ---------- UI helpers (SERVER SAFE) ---------- */

function Pill({ children, glow }: { children: React.ReactNode; glow?: boolean }) {
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

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{desc}</p>
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
