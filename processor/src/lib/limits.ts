export const PLAN_KEYS = ["free", "plus", "pro"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export type PlanLimits = {
  /** hard byte limit before spending processing */
  maxBytes: number;

  /** maximum allowed duration per file */
  maxSeconds: number;

  /** signed upload URL TTL */
  ttl: number;

  /** what to do if duration exceeds plan */
  behavior: "block";
};

export const limitsByPlan = {
  free: {
    // Free: realistic audio/video trial
    maxSeconds: 5 * 60,

    // Enough for reasonable mobile uploads without opening the door too much
    maxBytes: 80 * 1024 * 1024,

    ttl: 300, // 5 min
    behavior: "block",
  },

  plus: {
    // Plus: weekly creators
    maxSeconds: 10 * 60,

    // Good ceiling for regular creator workflows
    maxBytes: 200 * 1024 * 1024,

    ttl: 600, // 10 min
    behavior: "block",
  },

  pro: {
    // Pro: heavier creator workflows
    maxSeconds: 20 * 60,

    // Higher ceiling for larger files and more demanding uploads
    maxBytes: 400 * 1024 * 1024,

    ttl: 600, // 10 min
    behavior: "block",
  },
} satisfies Record<PlanKey, PlanLimits>;
