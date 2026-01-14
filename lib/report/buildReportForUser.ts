import { FullReport } from "./types";

const FULL_SECTIONS = 3; // SUMMARY, VIRAL REASON, KEY MOMENT

function previewText(text: string) {
  // listas
  if (text.match(/^\d+\./m)) {
    const lines = text.split("\n").filter(Boolean);
    const preview = lines.slice(0, 2).join("\n");
    return `${preview}\n\n— Unlock full insights with Pro.`;
  }

  // texto largo
  const max = Math.floor(text.length * 0.35);
  const slice = text.slice(0, max);
  const end = slice.lastIndexOf(".");

  return (
    (end > 80 ? slice.slice(0, end + 1) : slice) +
    "\n\n— Unlock full insights with Pro."
  );
}

export function buildReportForUser(
  report: FullReport,
  plan: "free" | "pro"
): FullReport {
  if (plan === "pro") return report;

  const keys = Object.keys(report);

  return Object.fromEntries(
    keys.map((key, index) => {
      const section = report[key];

      if (index < FULL_SECTIONS) {
        return [key, section];
      }

      return [
        key,
        {
          ...section,
          content: previewText(section.content),
          locked: true,
        },
      ];
    })
  );
}
