export const SECTION_META: Record<
  string,
  {
    label: string;
    icon: string;
    tier: "primary" | "secondary" | "pro";
    freePreviewRatio: number;
    copyActions?: Array<
      | "copy"
      | "copy_titles"
      | "copy_hooks"
      | "copy_hashtags"
      | "copy_clip_ideas"
      | "copy_reaction_script"
      | "copy_remix_ideas"
      | "copy_meme_templates"
      | "copy_predicted_longevity"
      | "copy_what_to_fix"
      | "copy_platform_strategy"
      | "copy_content_angle_variations"
      | "copy_target_audience_fit"
      | "copy_format_classification"
      | "copy_replication_framework"
      | "copy_summary"
      | "copy_viral_reason"
      | "copy_key_moment"
    >;
  }
> = {
  SUMMARY: {
    label: "Summary",
    icon: "🧠",
    tier: "primary",
    freePreviewRatio: 1,
    copyActions: ["copy", "copy_summary"],
  },
  "VIRAL REASON": {
    label: "Why This Can Go Viral",
    icon: "🚀",
    tier: "primary",
    freePreviewRatio: 1,
    copyActions: ["copy", "copy_viral_reason"],
  },
  "KEY MOMENT": {
    label: "Key Viral Moment",
    icon: "⏱️",
    tier: "primary",
    freePreviewRatio: 1,
    copyActions: ["copy", "copy_key_moment"],
  },

  "TITLE IDEAS": {
    label: "Title Ideas",
    icon: "✍️",
    tier: "secondary",
    freePreviewRatio: 0.5,
    copyActions: ["copy", "copy_titles"],
  },
  HOOKS: {
    label: "Hooks",
    icon: "🔥",
    tier: "secondary",
    freePreviewRatio: 0.4,
    copyActions: ["copy", "copy_hooks"],
  },
  HASHTAGS: {
    label: "Hashtags",
    icon: "#️⃣",
    tier: "secondary",
    freePreviewRatio: 0.4,
    copyActions: ["copy", "copy_hashtags"],
  },
  "CLIP IDEAS": {
    label: "Clip Ideas",
    icon: "🎬",
    tier: "secondary",
    freePreviewRatio: 0.4,
    copyActions: ["copy", "copy_clip_ideas"],
  },

  "REMIX IDEAS": {
    label: "Remix Ideas",
    icon: "🔁",
    tier: "pro",
    freePreviewRatio: 0.3,
    copyActions: ["copy", "copy_remix_ideas"],
  },
  "REACTION SCRIPT": {
    label: "Reaction Script",
    icon: "🎤",
    tier: "pro",
    freePreviewRatio: 0.3,
    copyActions: ["copy", "copy_reaction_script"],
  },
  "MEME TEMPLATES": {
    label: "Meme Templates",
    icon: "😂",
    tier: "pro",
    freePreviewRatio: 0.3,
    copyActions: ["copy", "copy_meme_templates"],
  },
  "PREDICTED LONGEVITY": {
    label: "Predicted Longevity",
    icon: "📈",
    tier: "pro",
    freePreviewRatio: 0.3,
    copyActions: ["copy", "copy_predicted_longevity"],
  },
  "WHAT TO FIX": {
    label: "What To Improve",
    icon: "🛠️",
    tier: "pro",
    freePreviewRatio: 0.25,
    copyActions: ["copy", "copy_what_to_fix"],
  },
  "PLATFORM STRATEGY": {
    label: "Platform Strategy",
    icon: "📱",
    tier: "pro",
    freePreviewRatio: 0.25,
    copyActions: ["copy", "copy_platform_strategy"],
  },
  "CONTENT ANGLE VARIATIONS": {
    label: "Content Angle Variations",
    icon: "🧩",
    tier: "pro",
    freePreviewRatio: 0.25,
    copyActions: ["copy", "copy_content_angle_variations"],
  },
  "TARGET AUDIENCE FIT": {
    label: "Target Audience Fit",
    icon: "🎯",
    tier: "pro",
    freePreviewRatio: 0.25,
    copyActions: ["copy", "copy_target_audience_fit"],
  },
  "FORMAT CLASSIFICATION": {
    label: "Format Classification",
    icon: "📂",
    tier: "pro",
    freePreviewRatio: 0.25,
    copyActions: ["copy", "copy_format_classification"],
  },
  "REPLICATION FRAMEWORK": {
    label: "Replication Framework",
    icon: "♻️",
    tier: "pro",
    freePreviewRatio: 0.2,
    copyActions: ["copy", "copy_replication_framework"],
  },
};
