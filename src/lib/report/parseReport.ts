const SECTION_NAMES = [
  "SUMMARY",
  "VIRAL REASON",
  "KEY MOMENT",
  "TITLE IDEAS",
  "HASHTAGS",
  "REMIX IDEAS",
  "REACTION SCRIPT",
  "MEME TEMPLATES",
  "HOOKS",
  "PREDICTED LONGEVITY",
  "VIRALITY SCORE",
  "WHAT TO FIX",
  "PLATFORM STRATEGY",
  "CLIP IDEAS",
  "CONTENT ANGLE VARIATIONS",
  "TARGET AUDIENCE FIT",
  "FORMAT CLASSIFICATION",
  "REPLICATION FRAMEWORK",
] as const;

export function parseViralReport(raw: string) {
  const report: Record<string, { title: string; content: string }> = {};

  for (let i = 0; i < SECTION_NAMES.length; i++) {
    const section = SECTION_NAMES[i];
    const nextSection = SECTION_NAMES[i + 1];

const start =
  raw.indexOf(`\n${section}`) !== -1
    ? raw.indexOf(`\n${section}`)
    : raw.startsWith(section)
    ? 0
    : -1;
    if (start === -1) {
      report[section] = {
        title: section,
        content: "No relevant data.",
      };
      continue;
    }

    const contentStart = start + section.length + 1;

    const end =
      nextSection
        ? raw.indexOf(`\n${nextSection}`, contentStart)
        : raw.length;

    const content = raw
      .slice(contentStart, end)
      .trim()
      .replace(/^\n+/, "");

    report[section] = {
      title: section,
      content: content || "No relevant data.",
    };
  }

  return report;
}
