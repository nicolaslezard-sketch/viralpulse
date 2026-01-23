import { FullReport } from "./types";

const FULL_SECTIONS = 3; // primeras 3 completas

function previewText(text: string) {
  const min = 120;
  const max = Math.floor(text.length * 0.35);
  const length = Math.max(min, max);

  return (
    text.slice(0, length).trim() +
    "\n\n🔒 Upgrade to unlock the full section."
  );
}

export function buildReportForUser(
  report: FullReport,
  plan: "free" | "pro"
): FullReport {
  if (plan === "pro") return report;

  // 🔒 usamos el orden REAL de las secciones parseadas
  const entries = Object.entries(report);

  return Object.fromEntries(
    entries.map(([key, section], index) => {
      if (index < FULL_SECTIONS) {
        return [key, section]; // completas
      }

      return [
        key,
        {
          ...section,
          content: previewText(section.content),
          locked: false, // ⚠️ importante: NO lock duro
        },
      ];
    })
  );
}
