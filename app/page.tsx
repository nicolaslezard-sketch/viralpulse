import UploadBox from "@/components/UploadBox";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          ViralPulse
        </h1>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
    Make your content go viral <br />
    <span className="text-zinc-400">before you post it</span>
  </h1>

  <p className="mt-6 text-lg text-zinc-400">
    Upload a video, audio, or podcast.
    <br />
    ViralPulse analyzes your content and shows you exactly how to maximize reach, hooks, titles, and engagement.
  </p>
  
      </section>

      {/* UPLOAD */}
      <section id="upload" className="mx-auto max-w-4xl px-6 pb-16">
        <UploadBox />
        <p className="mt-4 text-sm text-zinc-500">
      Free daily analysis • Upgrade to Pro for longer content & full transcript
    </p>
      </section>

      {/* WHAT HAPPENS */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t">
        <h2 className="text-2xl font-semibold text-center">
          What happens next
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <Step title="Transcription">
            We transcribe your content
          </Step>
          <Step title="Analysis">
            We analyze viral patterns
          </Step>
          <Step title="Generation">
            We generate hooks, titles & ideas
          </Step>
          <Step title="Publish">
            You copy & publish
          </Step>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t">
        <h2 className="text-2xl font-semibold text-center">
          What you get
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card title="Viral insights" />
          <Card title="Hooks & titles" />
          <Card title="Clip ideas" />
          <Card title="Platform strategy" />
          <Card title="Remix ideas" />
        </div>
      </section>

      {/* FREE vs PRO */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t">
        <h2 className="text-2xl font-semibold text-center">
          Free vs Pro
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Plan title="Free">
            <ul className="space-y-2 text-zinc-600">
              <li>• 1 analysis / day</li>
              <li>• Up to 3 minutes</li>
              <li>• Viral report (18 insights)</li>
            </ul>
          </Plan>
          <Plan title="Pro">
            <ul className="space-y-2 text-zinc-600">
              <li>• Unlimited analysis</li>
              <li>• Up to 20 minutes</li>
              <li>• Full transcript</li>
              <li>• Screen recording</li>
              <li>• History & copy tools</li>
            </ul>
          </Plan>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} ViralPulse
      </footer>
    </main>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-zinc-600">{children}</p>
    </div>
  );
}

function Card({ title }: { title: string }) {
  return (
    <div className="rounded-xl border p-6 text-center">
      <p className="font-medium">{title}</p>
    </div>
  );
}

function Plan({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
