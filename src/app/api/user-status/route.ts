import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { canUseFreeToday, ensureMonthlyReset } from "@/lib/usage/usage";
import { MONTHLY_MINUTES_BY_PLAN } from "@/lib/planLimits";
import type { PlanKey } from "@/lib/limits";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Public fallback (keeps client stable)
  if (!session?.user?.id) {
    return NextResponse.json({
      plan: "free",
      hasCard: false,
      freeDailyUsed: 0,
      freeDailyRemaining: 0,
      usedMinutesThisMonth: 0,
      monthlyLimit: MONTHLY_MINUTES_BY_PLAN.free,
      remainingMinutes: MONTHLY_MINUTES_BY_PLAN.free,
    });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      stripeCustomerId: true,
      usedMinutesThisMonth: true,
      usageMonth: true,
      email: true,
    },
  });

  const plan = (user?.plan ?? "free") as PlanKey;

  // Ensure monthly reset before we surface usage numbers
  await ensureMonthlyReset(userId);

  // Re-read used minutes after potential reset (cheap)
  const usedMinutesThisMonth =
    plan === "free"
      ? 0
      : (
          await prisma.user.findUnique({
            where: { id: userId },
            select: { usedMinutesThisMonth: true },
          })
        )?.usedMinutesThisMonth ?? 0;

  const monthlyLimit = MONTHLY_MINUTES_BY_PLAN[plan];
  const remainingMinutes = Math.max(0, monthlyLimit - (usedMinutesThisMonth ?? 0));

  // Daily free usage (only relevant for Free, but we return it always)
  const freeCheck = await canUseFreeToday(userId);
  const freeDailyUsed = freeCheck.usedToday;
  const freeDailyRemaining = freeCheck.remaining;

  let hasCard = false;

  if (user?.stripeCustomerId) {
    const pms = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
      limit: 1,
    });

    hasCard = pms.data.length > 0;
  }

  return NextResponse.json({
    plan,
    hasCard,

    // Usage snapshot for UI
    freeDailyUsed,
    freeDailyRemaining,

    usedMinutesThisMonth,
    monthlyLimit,
    remainingMinutes,
  });
}
