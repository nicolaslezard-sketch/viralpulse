import { prisma } from "@/lib/prisma";
import type { PlanKey } from "@/lib/limits";
import { MONTHLY_MINUTES_BY_PLAN, FREE_DAILY_ANALYSIS_LIMIT } from "@/lib/planLimits";

function monthKeyUTC(date: Date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // "YYYY-MM"
}

function dayKeyUTC(date: Date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // "YYYY-MM-DD"
}

/**
 * Resetea el contador mensual si cambió el mes.
 * Requiere que el User tenga:
 * - usedMinutesThisMonth Int @default(0)
 * - usageMonth String? (o String)
 */
export async function ensureMonthlyReset(userId: string) {
  const nowMonth = monthKeyUTC();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { usageMonth: true, usedMinutesThisMonth: true },
  });

  if (!user) return;

  // Si está null/undefined o cambió el mes: reset
  if (user.usageMonth !== nowMonth) {
    await prisma.user.update({
      where: { id: userId },
      data: { usageMonth: nowMonth, usedMinutesThisMonth: 0 },
    });
  }
}

export async function canConsumeMonthlyMinutes(params: {
  userId: string;
  plan: PlanKey;
  minutesToConsume: number;
}) {
  const { userId, plan, minutesToConsume } = params;

  await ensureMonthlyReset(userId);

  const limit = MONTHLY_MINUTES_BY_PLAN[plan];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { usedMinutesThisMonth: true },
  });

  const used = user?.usedMinutesThisMonth ?? 0;
  const remaining = Math.max(0, limit - used);

  return {
    ok: minutesToConsume <= remaining,
    limit,
    used,
    remaining,
  };
}

export async function consumeMonthlyMinutes(params: {
  userId: string;
  minutesToConsume: number;
}) {
  const { userId, minutesToConsume } = params;

  await prisma.user.update({
    where: { id: userId },
    data: { usedMinutesThisMonth: { increment: minutesToConsume } },
  });
}

/**
 * Free: 3 análisis por día.
 * Requiere un modelo Prisma:
 *
 * model DailyUsage {
 *   id     String @id @default(cuid())
 *   userId String
 *   day    String // "YYYY-MM-DD"
 *   count  Int    @default(0)
 *
 *   @@unique([userId, day])
 * }
 */
export async function canUseFreeToday(userId: string) {
  const day = dayKeyUTC();

  const row = await prisma.dailyUsage.findUnique({
    where: { userId_day: { userId, day } },
    select: { count: true },
  });

  const usedToday = row?.count ?? 0;
  const remaining = Math.max(0, FREE_DAILY_ANALYSIS_LIMIT - usedToday);

  return { ok: remaining > 0, usedToday, remaining };
}

export async function consumeFreeToday(userId: string) {
  const day = dayKeyUTC();

  await prisma.dailyUsage.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, count: 1 },
    update: { count: { increment: 1 } },
  });
}
