import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { limitsByPlan } from "@/lib/limits";
import {
  MONTHLY_MINUTES_BY_PLAN,
  FREE_DAILY_ANALYSIS_LIMIT,
} from "@/lib/planLimits";
import { ensureMonthlyReset } from "@/lib/usage/usage";

function dayKeyUTC(date: Date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const plan = await getUserPlan(userId);

  await ensureMonthlyReset(userId);

  const [user, dailyUsage] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        usedMinutesThisMonth: true,
        usageMonth: true,
      },
    }),
    prisma.dailyUsage.findUnique({
      where: {
        userId_day: {
          userId,
          day: dayKeyUTC(),
        },
      },
      select: {
        count: true,
      },
    }),
  ]);

  const usedMinutesThisMonth = user?.usedMinutesThisMonth ?? 0;
  const monthlyLimit = MONTHLY_MINUTES_BY_PLAN[plan];
  const monthlyRemaining = Math.max(0, monthlyLimit - usedMinutesThisMonth);

  const freeUsedToday = dailyUsage?.count ?? 0;
  const freeRemainingToday = Math.max(
    0,
    FREE_DAILY_ANALYSIS_LIMIT - freeUsedToday,
  );

  return NextResponse.json({
    plan,
    limits: {
      maxSeconds: limitsByPlan[plan].maxSeconds,
      maxBytes: limitsByPlan[plan].maxBytes,
    },
    usage: {
      usedMinutesThisMonth,
      monthlyLimit,
      monthlyRemaining,
      freeDailyLimit: FREE_DAILY_ANALYSIS_LIMIT,
      freeUsedToday,
      freeRemainingToday,
      usageMonth: user?.usageMonth ?? null,
    },
  });
}
