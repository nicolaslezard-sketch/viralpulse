import { REPORT_SECTIONS, type ReportSectionKey } from "./sectionNames";
import type { FullReport } from "./types";

export function parseViralReport(raw: string): FullReport {
  const report: Partial<FullReport> = {};

  const lines = raw.split("\n");
  let current: ReportSectionKey | null = null;
  let buffer: string[] = [];

  const normalize = (s: string) =>
    s
      .toUpperCase()
      .replace(/^\d+\)\s*/, "") // "4) TITLE IDEAS" → "TITLE IDEAS"
      .trim();

  for (const line of lines) {
    const clean = normalize(line);

    if (REPORT_SECTIONS.includes(clean as ReportSectionKey)) {
      if (current) {
        report[current] = {
          title: current,
          content: buffer.join("\n").trim() || "No relevant data.",
        };
      }

      current = clean as ReportSectionKey;
      buffer = [];
      continue;
    }

    if (current) buffer.push(line);
  }

  // flush final section
  if (current) {
    report[current] = {
      title: current,
      content: buffer.join("\n").trim() || "No relevant data.",
    };
  }

  // 🔒 asegurar que TODAS las secciones existan (las 18)
  for (const key of REPORT_SECTIONS) {
    if (!report[key]) {
      report[key] = {
        title: key,
        content: "No relevant data.",
      };
    }
  }

  return report as FullReport;
}
