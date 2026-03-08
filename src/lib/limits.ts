export const PLAN_KEYS = ["free", "plus", "pro"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export type PlanLimits = {
  /** límite duro de bytes (firewall infra, antes de gastar) */
  maxBytes: number;

  /** duración máxima permitida (hard limit) */
  maxSeconds: number;

  /** TTL del signed upload URL */
  ttl: number;

  /** qué hacer si excede duración */
  behavior: "block";
};

export const limitsByPlan = {
  free: {
    // Free: video/audio realista para probar el producto
    maxSeconds: 5 * 60,

    // 80 MB: suficiente para mobile video razonable sin regalar archivos absurdos
    maxBytes: 80 * 1024 * 1024,

    ttl: 300, // 5 min
    behavior: "block",
  },

  plus: {
    // Plus: creators semanales
    maxSeconds: 10 * 60,

    // Permitimos hasta 200 MB para no romper la promesa de video upload
    maxBytes: 200 * 1024 * 1024,

    ttl: 600, // 10 min
    behavior: "block",
  },

  pro: {
    // Pro: daily creators / long-form workflows
    maxSeconds: 20 * 60,

    maxBytes: 200 * 1024 * 1024,

    ttl: 600, // 10 min
    behavior: "block",
  },
} satisfies Record<PlanKey, PlanLimits>;
