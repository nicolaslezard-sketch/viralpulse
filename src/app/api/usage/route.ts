import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  MONTHLY_MINUTES_BY_PLAN,
  FREE_DAILY_ANALYSIS_LIMIT,
} from "@/lib/planLimits";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      usedMinutesThisMonth: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🆓 FREE — límite diario
  if (user.plan === "free") {
    const today = new Date().toISOString().slice(0, 10);

    const daily = await prisma.dailyUsage.findUnique({
      where: {
        userId_day: {
          userId,
          day: today,
        },
      },
      select: { count: true },
    });

    const used = daily?.count ?? 0;
    const remaining = Math.max(0, FREE_DAILY_ANALYSIS_LIMIT - used);

    return NextResponse.json({
      plan: "free",
      freeDailyUsed: used,
      freeDailyRemaining: remaining,
    });
  }

  // 💳 PLUS / PRO — minutos mensuales
  const limit = MONTHLY_MINUTES_BY_PLAN[user.plan];

  return NextResponse.json({
    plan: user.plan,
    usedMinutesThisMonth: user.usedMinutesThisMonth,
    monthlyLimit: limit,
  });
}
