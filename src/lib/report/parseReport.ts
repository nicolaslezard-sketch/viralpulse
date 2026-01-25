import { REPORT_SECTIONS } from "./sectionNames";

export function parseViralReport(raw: string) {
  const report: Record<string, { title: string; content: string }> = {};

  for (let i = 0; i < REPORT_SECTIONS.length; i++) {
    const section = REPORT_SECTIONS[i];
    const next = REPORT_SECTIONS[i + 1];

    const start =
      raw.indexOf(`\n${section}`) !== -1
        ? raw.indexOf(`\n${section}`)
        : raw.startsWith(section)
        ? 0
        : -1;

    if (start === -1) {
      report[section] = { title: section, content: "" };
      continue;
    }

    const contentStart = start + section.length;
    const end = next
      ? raw.indexOf(`\n${next}`, contentStart)
      : raw.length;

    report[section] = {
      title: section,
      content: raw.slice(contentStart, end).trim(),
    };
  }

  return report;
}
