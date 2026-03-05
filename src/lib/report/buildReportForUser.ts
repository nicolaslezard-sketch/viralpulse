import { FullReport } from "./types";
const FULL_SECTIONS = 3; // primeras 3 completas
function previewText(text: string) {
  const min = 120;
  const max = Math.floor(text.length * 0.35);
  const length = Math.max(min, max);

  return (
    text.slice(0, length).trim() + "\n\n🔒 Upgrade to unlock the full section."
  );
}
export function buildReportForUser(
  report: FullReport,
  plan: "free" | "plus" | "pro",
): FullReport {
  if (plan !== "free") return report;

  const entries = Object.entries(report.sections);

  const previewSections = Object.fromEntries(
    entries.map(([key, section], index) => {
      if (index < FULL_SECTIONS) {
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

  return {
    ...report,
    sections: previewSections,
  };
}