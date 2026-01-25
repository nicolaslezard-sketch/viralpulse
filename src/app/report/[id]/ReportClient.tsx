"use client";

import { useEffect, useState } from "react";
import SectionBlock from "@/components/SectionBlock";
import ResultsView from "@/components/ResultsView";
import AnalyzingExperience from "@/components/AnalyzingExperience";


type ReportStatus = "processing" | "done" | "error";

type ReportResponse = {
  id: string;
  status: ReportStatus;
  duration: number;
  wasTrimmed: boolean;
  report: string | null;
  transcript: string | null;
  isPro: boolean;
  createdAt: string;
};

const STEPS = [
  "Uploading file",
  "Transcribing audio",
  "Analyzing structure",
  "Detecting hooks",
  "Generating titles & clips",
  "Finalizing report",
];

function splitSectionsByTitle(report: string) {
  const TITLES = [
    "SUMMARY",
    "VIRAL REASON",
    "KEY MOMENT",
    "TITLE IDEAS",
    "HOOKS",
    "HASHTAGS",
    "CLIP IDEAS",
    "REMIX IDEAS",
    "REACTION SCRIPT",
    "MEME TEMPLATES",
    "PREDICTED LONGEVITY",
    "VIRALITY SCORE",
    "WHAT TO FIX",
    "PLATFORM STRATEGY",
    "CONTENT ANGLE VARIATIONS",
    "TARGET AUDIENCE FIT",
    "FORMAT CLASSIFICATION",
    "REPLICATION FRAMEWORK",
  ];

  const regex = new RegExp(`^(${TITLES.join("|")})$`, "m");
  const lines = report.split("\n");

  const sections: { title: string; content: string }[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (regex.test(line.trim())) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: buffer.join("\n").trim(),
        });
      }
      currentTitle = line.trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }

  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: buffer.join("\n").trim(),
    });
  }

  return sections;
}

const ACTION_SECTIONS = [
  "TITLE IDEAS",
  "HOOKS",
  "CLIP IDEAS",
  "HASHTAGS",
];

/* ==========================
   COMPONENT
========================== */

export default function ReportClient({ reportId }: { reportId: string }) {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);


  async function fetchReport() {
    try {
      const res = await fetch(`/api/report/${reportId}`);
      if (!res.ok) throw new Error("Failed to load report");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Error loading report");
    }
  }

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  // polling mientras procesa
  useEffect(() => {
    if (data?.status === "processing") {
      const t = setTimeout(fetchReport, 3000);
      return () => clearTimeout(t);
    }
  }, [data?.status]);


  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* ==========================
      ERROR / LOADING
  ========================== */

  if (error) {
    return <div className="p-8 text-red-500 fade-up">❌ {error}</div>;
  }

  if (!data) {
    return <div className="p-8 fade-up">⏳ Loading report…</div>;
  }

  if (data.status === "processing") {
  return <AnalyzingExperience />;
}

if (data.status === "error") {
  return <div className="p-8 fade-up">❌ Analysis failed</div>;
}

  /* ==========================
      DONE
  ========================== */

  const sections = data.report
  ? splitSectionsByTitle(data.report)
  : [];

const actionSections = sections.filter(
  (section) => ACTION_SECTIONS.includes(section.title)
);

const otherSections = sections.filter(
  (section) => !ACTION_SECTIONS.includes(section.title)
);

  return (
    <div
  className="
    min-h-screen w-full
    bg-[url('/bg-abstract.jpg')]
    bg-cover bg-center bg-no-repeat
  "
>
  {/* OVERLAY */}
  <div className="min-h-screen w-full bg-black/65 backdrop-blur-sm">
    
    {/* CONTENT WRAPPER */}
    <div className="relative p-8 space-y-10 max-w-4xl mx-auto fade-up">

      {/* ================= HEADER ================= */}
      <div className="relative text-center space-y-4 py-6">
        {/* glow */}
        <div className="absolute inset-0 -z-10 blur-3xl bg-indigo-500/30 rounded-full" />

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Analysis complete
        </h1>

        <div className="flex justify-center gap-4 text-xs text-zinc-300">
          <span>⏱ {Math.round(data.duration)} sec</span>
          {data.wasTrimmed && <span>✂ Trimmed</span>}
          <span className="font-semibold">{data.isPro ? "PRO" : "FREE"}</span>
        </div>
      </div>

      {/* ================= FREE BANNER ================= */}
      {!data.isPro && (
        <div
          className="
            relative overflow-hidden
            rounded-2xl
            border border-indigo-500/30
            bg-indigo-500/10
            backdrop-blur
            px-6 py-4
            shadow-lg shadow-indigo-500/10
            transition-all
            hover:scale-[1.01]
          "
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-indigo-200">
                Preview mode
              </p>
              <p className="text-xs text-indigo-200/70">
                Upgrade to unlock the full report, transcript & longer uploads
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACTION SECTIONS ================= */}
      {actionSections.length > 0 && (
        <div
          className="
  mb-14
  rounded-[32px]
  border border-indigo-400/30
  bg-indigo-500/10
  backdrop-blur-2xl
  p-8
  shadow-[0_30px_90px_rgba(0,0,0,0.75)]
"

        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">
              🚀 Ready to publish
            </h2>
            <p className="mt-1 text-sm text-zinc-300">
              Titles, hooks, clips and hashtags you can copy and post immediately
            </p>
          </div>

          <div className="space-y-6">
            {actionSections.map((section, i) => (
  <SectionBlock
    key={`action-${i}`}
    title={section.title}
    content={section.content}
    isPro={data.isPro}
  />
))}

          </div>
        </div>
      )}

      {/* ================= ANALYSIS SECTIONS ================= */}
<div
  className="
    mb-14
    rounded-[32px]
    p-8
    backdrop-blur-2xl
    border border-indigo-400/30
    bg-indigo-500/10
    shadow-[0_30px_90px_rgba(0,0,0,0.75)]
  "
>
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-white">
      📊 Full analysis
    </h2>
    <p className="mt-1 text-sm text-zinc-400">
      Strategic breakdown, insights and recommendations
    </p>
  </div>

  <div className="space-y-6">
    {otherSections.map((section, i) => (
  <SectionBlock
    key={`other-${i}`}
    title={section.title}
    content={section.content}
    isPro={data.isPro}
  />
))}

  </div>
</div>


      {/* ================= UPGRADE CTA ================= */}
      {!data.isPro && (
        <div
          className="
            rounded-2xl
            border border-indigo-500/30
            bg-indigo-500/10
            backdrop-blur
            p-8
            text-center
            shadow-lg
          "
        >
          <p className="mb-4 text-lg font-semibold text-white">
            🔓 Unlock the full report & unlimited analysis
          </p>
          <a
            href="/pricing"
            className="
              inline-block
              px-6 py-3
              rounded-full
              bg-gradient-to-r from-indigo-500 to-indigo-400
              text-white font-semibold
              shadow-lg shadow-indigo-500/30
              hover:brightness-110
              transition
            "
          >
            Upgrade to Pro
          </a>
        </div>
      )}

      {/* ================= TRANSCRIPT ================= */}
      {data.isPro && data.transcript && (
        <details
          className="
            rounded-2xl
            border border-white/30
            bg-zinc-950/70
            backdrop-blur
            p-6
          "
        >
          <summary className="cursor-pointer text-sm font-semibold text-white">
            📝 View full transcript
          </summary>
          <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-300">
            {data.transcript}
          </pre>
        </details>
      )}

    </div>
  </div>
</div>

  );
}
