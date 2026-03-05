import type { FullReport } from "./types";

export function normalizeReport(report: any): FullReport | null {
  if (!report) return null;

  // ya es formato nuevo
  if (report.sections) return report as FullReport;

  // formato viejo
  const sections: Record<string, { title: string; content: string }> = {};

  for (const key of Object.keys(report)) {
    const section = report[key];

    if (section && typeof section === "object" && "content" in section) {
      sections[key] = {
        title: section.title ?? key,
        content: section.content ?? "",
      };
    }
  }

  return {
    sections,
    metrics: {
      hookStrength: 0,
      retentionPotential: 0,
      emotionalImpact: 0,
      shareability: 0,
      finalScore: 0,
    },
    rewrite: undefined,
  };
}
