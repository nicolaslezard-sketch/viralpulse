export const REPORT_TITLES = [
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
];

export function splitReportByTitle(report: string) {
  const regex = new RegExp(`^(${REPORT_TITLES.join("|")})$`, "m");
  const lines = report.split("\n");

  const sections: { title: string; content: string }[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (regex.test(line.trim())) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: buffer.join("\n").trim(),
        });
      }
      currentTitle = line.trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }

  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: buffer.join("\n").trim(),
    });
  }

  return sections;
}
