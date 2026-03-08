import { FullReport } from "./types";

const FREE_FULL_SECTION_KEYS = new Set([
  "SUMMARY",
  "VIRAL REASON",
  "WHAT TO FIX",
]);

function previewText(
  text: string,
  opts?: { min?: number; maxRatio?: number; maxChars?: number },
) {
  const raw = (text || "").trim();
  if (!raw) return "🔒 Upgrade to unlock this section.";

  const min = opts?.min ?? 120;
  const maxRatio = opts?.maxRatio ?? 0.24;
  const maxChars = opts?.maxChars ?? 180;

  const targetLength = Math.min(
    maxChars,
    Math.max(min, Math.floor(raw.length * maxRatio)),
  );

  const sliced = raw.slice(0, targetLength).trim();

  return `${sliced}…`;
}

export function buildReportForUser(
  report: FullReport,
  plan: "free" | "plus" | "pro",
): FullReport {
  if (plan !== "free") return report;

  const previewSections = Object.fromEntries(
    Object.entries(report.sections).map(([key, section]) => {
      if (FREE_FULL_SECTION_KEYS.has(key)) {
        return [key, section];
      }

      return [
        key,
        {
          ...section,
          content: previewText(section.content),
        },
      ];
    }),
  );

  const rewrite = report.rewrite
    ? {
        hookRewrite: previewText(report.rewrite.hookRewrite, {
          min: 70,
          maxRatio: 0.35,
          maxChars: 120,
        }),
        optimizedScript: previewText(report.rewrite.optimizedScript, {
          min: 110,
          maxRatio: 0.16,
          maxChars: 220,
        }),
        titles: report.rewrite.titles.slice(0, 2).map((title) =>
          previewText(title, {
            min: 20,
            maxRatio: 0.6,
            maxChars: 60,
          }),
        ),
        thumbnailIdea: previewText(report.rewrite.thumbnailIdea, {
          min: 55,
          maxRatio: 0.35,
          maxChars: 110,
        }),
      }
    : undefined;

  return {
    ...report,
    sections: previewSections,
    rewrite,
  };
}
