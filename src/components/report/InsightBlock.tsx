import Link from "next/link";
import { InsightCard } from "./InsightCard";
import type { FullReport } from "@/lib/report/types";

type Props = {
  title: string;
  sections: string[];
  report: FullReport;
  isPro: boolean;
};

function previewLines(text: string, maxLines = 3) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= maxLines) return lines.join("\n");

  return `${lines.slice(0, maxLines).join("\n")}\n…`;
}

function PreviewLockedCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const preview = previewLines(content, 3);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020617] p-6">
      <h3 className="mb-3 text-sm font-semibold text-indigo-300">{title}</h3>

      <div className="relative min-h-[190px]">
        <div className="whitespace-pre-line pr-1 text-sm leading-relaxed text-zinc-200">
          {preview}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-4 text-center">
          <div className="text-sm font-semibold text-white">
            🔒 Premium Insight
          </div>

          <p className="max-w-xs text-xs text-zinc-400">
            Unlock the full insight, deeper context and actionable strategy.
          </p>

          <Link
            href="/pricing"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}

export function InsightBlock({ title, sections, report, isPro }: Props) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 text-lg font-semibold tracking-wide text-indigo-300">
        {title}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((key) => {
          const section = report.sections[key];
          if (!section) return null;

          const alwaysOpen = ["SUMMARY", "VIRAL REASON"].includes(key);
          const locked = !isPro && !alwaysOpen;

          if (locked) {
            return (
              <PreviewLockedCard
                key={key}
                title={section.title}
                content={section.content}
              />
            );
          }

          return (
            <InsightCard
              key={key}
              title={section.title}
              content={section.content}
            />
          );
        })}
      </div>
    </div>
  );
}
