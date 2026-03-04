import { REPORT_SECTIONS, type ReportSectionKey } from "./sectionNames";
import type { FullReport } from "./types";
import type { ViralReportJson } from "./schema";

export function toFullReport(payload: ViralReportJson): FullReport {
  const report = {} as FullReport;

  for (const key of REPORT_SECTIONS) {
    const content =
      (payload.sections as Record<string, string>)[key] ?? "No relevant data.";

    report[key as ReportSectionKey] = {
      title: key as ReportSectionKey,
      content: String(content).trim() || "No relevant data.",
    };
  }

  return report;
}
