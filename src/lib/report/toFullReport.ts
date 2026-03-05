import type { FullReport } from "./types";
import type { ReportSectionKey } from "./sectionNames";

export function toFullReport(payload: unknown): FullReport {
  const data = payload as any;

  const report: FullReport = {
    sections: {},
    metrics: data.metrics ?? {
      hookStrength: 0,
      retentionPotential: 0,
      emotionalImpact: 0,
      shareability: 0,
      finalScore: 0,
    },
    rewrite: data.rewrite,
  };

  const sections = data.sections ?? {};

  for (const key of Object.keys(sections) as ReportSectionKey[]) {
    const content =
      (sections as Record<string, string>)[key] ?? "No relevant data.";

    report.sections[key] = {
      title: key,
      content: String(content).trim() || "No relevant data.",
    };
  }

  return report;
}
