import { FullReport } from "./types";

const FREE_FULL_SECTION_KEYS = new Set([
  "SUMMARY",
  "VIRAL REASON",
  "WHAT TO FIX",
]);

function previewText(text: string, opts?: { min?: number; maxRatio?: number }) {
  const raw = (text || "").trim();
  if (!raw) return "🔒 Upgrade to unlock this section.";

  const min = opts?.min ?? 160;
  const maxRatio = opts?.maxRatio ?? 0.3;

  const targetLength = Math.max(min, Math.floor(raw.length * maxRatio));

  if (raw.length <= targetLength) {
    return raw;
  }

  const sliced = raw.slice(0, targetLength);
  const lastBreak =
    Math.max(sliced.lastIndexOf("\n\n"), sliced.lastIndexOf(". ")) ||
    sliced.length;

  const safe =
    lastBreak > Math.floor(targetLength * 0.55)
      ? sliced.slice(0, lastBreak).trim()
      : sliced.trim();

  return `${safe}\n\n🔒 Upgrade to unlock the full section.`;
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
          min: 120,
          maxRatio: 0.45,
        }),
        optimizedScript: previewText(report.rewrite.optimizedScript, {
          min: 180,
          maxRatio: 0.22,
        }),
        titles: report.rewrite.titles.slice(0, 2).map((title) =>
          previewText(title, {
            min: 24,
            maxRatio: 0.85,
          }),
        ),
        thumbnailIdea: previewText(report.rewrite.thumbnailIdea, {
          min: 80,
          maxRatio: 0.45,
        }),
      }
    : undefined;

  return {
    ...report,
    sections: previewSections,
    rewrite,
  };
}
