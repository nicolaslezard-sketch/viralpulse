import type { FullReport } from "./types";
import type { ReportSectionKey } from "./sectionNames";

type ReportPayload = {
  metrics?: FullReport["metrics"];
  rewrite?: FullReport["rewrite"];
  sections?: Record<string, unknown>;
};

function isReportPayload(payload: unknown): payload is ReportPayload {
  return typeof payload === "object" && payload !== null;
}

export function toFullReport(payload: unknown): FullReport {
  const data: ReportPayload = isReportPayload(payload) ? payload : {};

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
    const content = sections[key] ?? "No relevant data.";

    report.sections[key] = {
      title: key,
      content: String(content).trim() || "No relevant data.",
    };
  }

  return report;
}
