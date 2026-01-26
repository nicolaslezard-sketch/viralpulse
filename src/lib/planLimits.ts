import type { PlanKey } from "@/lib/limits";

/**
 * Fuente única de verdad para límites de "consumo" (minutos mensuales).
 * Los límites por request (duración/tamaño/TTL) viven en `limits.ts`.
 */
export const MONTHLY_MINUTES_BY_PLAN: Record<PlanKey, number> = {
  // Free: el límite real es 1 análisis/día; esto es un guardrail extra.
  free: 60,

  // Plus: 120 min/mes (capacidad)
  plus: 120,

  // Pro: 400 min/mes (capacidad)
  pro: 400,
};

/** Free: 1 análisis por día */
export const FREE_DAILY_ANALYSIS_LIMIT = 1;
