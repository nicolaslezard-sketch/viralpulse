export const PLAN_KEYS = ["free", "pro"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export type PlanLimits = {
  /** límite duro de bytes para proteger infra (no UX) */
  maxBytes: number;
  /** duración máxima permitida por plan */
  maxSeconds: number;
  /** TTL del signed upload URL */
  ttl: number;
  /** qué hacer si excede duración */
  behavior: "trim" | "block";
};

export const limitsByPlan = {
  free: {
    // UX: hasta 3 min
    maxSeconds: 3 * 60,

    // Soft limit de peso (acepta WAV/M4A/WebM cortos sin fricción)
    maxBytes: 25 * 1024 * 1024, // 25 MB

    // Signed URL válida unos minutos
    ttl: 300, // 5 min

    // Free recorta
    behavior: "trim",
  },
  pro: {
    // UX: hasta 20 min
    maxSeconds: 20 * 60,

    // Soft limit amplio (normalización reduce luego)
    maxBytes: 200 * 1024 * 1024, // 200 MB

    // Signed URL un poco más larga
    ttl: 600, // 10 min

    // Pro bloquea si excede
    behavior: "block",
  },
} satisfies Record<PlanKey, PlanLimits>;
