import type { FullReport } from "./types";

type LegacySection = {
  title?: unknown;
  content?: unknown;
};

type LegacyReport = Record<string, unknown> & {
  sections?: unknown;
  rewrite?: FullReport["rewrite"];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLegacySection(value: unknown): value is LegacySection {
  return isObject(value) && "content" in value;
}

export function normalizeReport(report: unknown): FullReport | null {
  if (!isObject(report)) return null;

  const candidate = report as LegacyReport;

  // ya es formato nuevo
  if (candidate.sections) {
    return {
      ...(candidate as unknown as FullReport),
      rewrite: candidate.rewrite ?? undefined,
    };
  }

  // formato viejo
  const sections: Record<string, { title: string; content: string }> = {};

  for (const key of Object.keys(candidate)) {
    const section = candidate[key];

    if (isLegacySection(section)) {
      sections[key] = {
        title: typeof section.title === "string" ? section.title : key,
        content: typeof section.content === "string" ? section.content : "",
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
    rewrite: candidate.rewrite ?? undefined,
  };
}
