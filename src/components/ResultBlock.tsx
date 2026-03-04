"use client";

import React from "react";
import CopyButton from "./CopyButton";

type SectionKey =
  | "SUMMARY"
  | "VIRAL REASON"
  | "KEY MOMENT"
  | "TITLE IDEAS"
  | "HASHTAGS"
  | "REMIX IDEAS"
  | "REACTION SCRIPT"
  | "MEME TEMPLATES"
  | "HOOKS"
  | "PREDICTED LONGEVITY"
  | "WHAT TO FIX"
  | "PLATFORM STRATEGY"
  | "CLIP IDEAS"
  | "CONTENT ANGLE VARIATIONS"
  | "TARGET AUDIENCE FIT"
  | "FORMAT CLASSIFICATION"
  | "REPLICATION FRAMEWORK";

type FullReport = Record<
  SectionKey,
  {
    title: string;
    content: string;
  }
>;

type Props = {
  report: FullReport;
  viralScore?: number | null;
  viralMetrics?: {
    hookStrength: number;
    retentionPotential: number;
    emotionalImpact: number;
    shareability: number;
    finalScore: number;
  } | null;
};

const GROUPS: Array<{
  title: string;
  subtitle: string;
  keys: SectionKey[];
}> = [
  {
    title: "UNDERSTAND",
    subtitle: "What it is, why it works, who it’s for",
    keys: [
      "SUMMARY",
      "VIRAL REASON",
      "FORMAT CLASSIFICATION",
      "TARGET AUDIENCE FIT",
    ],
  },
  {
    title: "WHAT TO DO",
    subtitle: "Immediate improvements + ready-to-use assets",
    keys: ["WHAT TO FIX", "HOOKS", "TITLE IDEAS"],
  },
  {
    title: "CLIPS & REUSE",
    subtitle: "Cut points, reuse angles and remix options",
    keys: [
      "KEY MOMENT",
      "CLIP IDEAS",
      "REMIX IDEAS",
      "CONTENT ANGLE VARIATIONS",
    ],
  },
  {
    title: "CREATIVE OUTPUTS",
    subtitle: "Scripts and meme-ready text",
    keys: ["REACTION SCRIPT", "MEME TEMPLATES"],
  },
  {
    title: "DISTRIBUTION",
    subtitle: "Where to post + discovery",
    keys: ["PLATFORM STRATEGY", "HASHTAGS", "PREDICTED LONGEVITY"],
  },
  {
    title: "REPLICATION",
    subtitle: "How to replicate this structure in future content",
    keys: ["REPLICATION FRAMEWORK"],
  },
];

function Card({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-sm tracking-wide">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs font-semibold">
      {children}
    </span>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <pre className="whitespace-pre-wrap text-sm text-zinc-200 font-mono leading-relaxed m-0">
      {text}
    </pre>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3">
      <div>
        <div className="text-xs font-bold tracking-wider opacity-80">
          {title}
        </div>
        <div className="text-sm text-zinc-400">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

export default function ResultBlock({
  report,
  viralScore,
  viralMetrics,
}: Props) {
  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="sticky top-4 z-10 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>
            Viral Score:{" "}
            {viralScore !== null && viralScore !== undefined
              ? `${viralScore.toFixed(1)} / 100`
              : "—"}
          </Badge>

          {viralMetrics && (
            <>
              <Badge>Hook: {viralMetrics.hookStrength}</Badge>
              <Badge>Retention: {viralMetrics.retentionPotential}</Badge>
              <Badge>Emotion: {viralMetrics.emotionalImpact}</Badge>
              <Badge>Shareability: {viralMetrics.shareability}</Badge>
            </>
          )}

          <div className="ml-auto">
            <CopyButton
              text={JSON.stringify(report, null, 2)}
              label="Copy JSON"
            />
          </div>
        </div>
      </div>

      {GROUPS.map((group) => (
        <Section
          key={group.title}
          title={group.title}
          subtitle={group.subtitle}
        >
          <div className="grid gap-4">
            {group.keys.map((key) => {
              const content = report[key]?.content ?? "(No content generated)";

              const isCopyHeavy =
                key === "HOOKS" ||
                key === "TITLE IDEAS" ||
                key === "HASHTAGS" ||
                key === "REACTION SCRIPT" ||
                key === "MEME TEMPLATES" ||
                key === "WHAT TO FIX" ||
                key === "REPLICATION FRAMEWORK" ||
                key === "CLIP IDEAS";

              return (
                <Card
                  key={key}
                  title={key}
                  right={
                    isCopyHeavy ? <CopyButton text={content} /> : undefined
                  }
                >
                  <TextBlock text={content} />
                </Card>
              );
            })}
          </div>
        </Section>
      ))}
    </div>
  );
}
