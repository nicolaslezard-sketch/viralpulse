import type { ReportSectionKey } from "./sectionNames";

export const SECTION_GROUPS: Record<string, ReportSectionKey[]> = {
  core: ["SUMMARY", "VIRAL REASON", "KEY MOMENT", "WHAT TO FIX"],

  growth: ["HOOKS", "TITLE IDEAS", "CLIP IDEAS", "CONTENT ANGLE VARIATIONS"],

  distribution: [
    "HASHTAGS",
    "PLATFORM STRATEGY",
    "TARGET AUDIENCE FIT",
    "PREDICTED LONGEVITY",
  ],

  advanced: [
    "REMIX IDEAS",
    "REACTION SCRIPT",
    "MEME TEMPLATES",
    "FORMAT CLASSIFICATION",
    "REPLICATION FRAMEWORK",
  ],
};
