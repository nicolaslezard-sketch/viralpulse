import Link from "next/link";
import { InsightCard } from "./InsightCard";
import type { FullReport } from "@/lib/report/types";

type Props = {
  title: string;
  sections: string[];
  report: FullReport;
  isPaid: boolean;
};

const FREE_OPEN_SECTIONS = new Set(["SUMMARY", "VIRAL REASON", "WHAT TO FIX"]);

function lockedPreviewText(text: string, maxChars = 110) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "Preview locked.";
  if (clean.length <= maxChars) {
    return `${clean.slice(0, Math.max(36, Math.floor(clean.length * 0.7))).trim()}…`;
  }
  return `${clean.slice(0, maxChars).trim()}…`;
}

function PreviewLockedCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const preview = lockedPreviewText(content, 110);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020617] p-6">
      <h3 className="mb-3 text-sm font-semibold text-indigo-300">{title}</h3>

      <div className="relative min-h-52.5">
        <div className="max-w-full pr-1 text-sm leading-relaxed text-zinc-300 opacity-90 select-none">
          {" "}
          {preview}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#020617] via-[#020617]/94 to-transparent" />
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
            Upgrade now
          </Link>
        </div>
      </div>
    </div>
  );
}

export function InsightBlock({ title, sections, report, isPaid }: Props) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 text-lg font-semibold tracking-wide text-indigo-300">
        {title}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((key) => {
          const section = report.sections[key];
          if (!section) return null;

          const isOpenForFree = FREE_OPEN_SECTIONS.has(key);
          const locked = !isPaid && !isOpenForFree;

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
