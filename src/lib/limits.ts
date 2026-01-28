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
    // UX: 5 minutos máx (1 audio por día)
    maxSeconds: 5 * 60,

    // Firewall real: evita audios largos comprimidos
    maxBytes: 10 * 1024 * 1024, // 🔒 10 MB

    // Signed URL corta
    ttl: 300, // 5 min

    // Whisper no se ejecuta si excede
    behavior: "block",
  },

  plus: {
    // UX: hasta 10 min
    maxSeconds: 10 * 60,

    // Suficiente para MP3 / M4A normales
    maxBytes: 80 * 1024 * 1024, // 80 MB

    ttl: 600, // 10 min

    behavior: "block",
  },

  pro: {
    // UX: hasta 20 min
    maxSeconds: 20 * 60,

    // Audios largos, alta calidad
    maxBytes: 200 * 1024 * 1024, // 200 MB

    ttl: 600, // 10 min

    behavior: "block",
  },
} satisfies Record<PlanKey, PlanLimits>;
