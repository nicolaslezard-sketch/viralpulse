import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { transcribeFromR2 } from "@/lib/analysis/transcribeFromR2";
import { generateReport } from "@/lib/report/generateReport";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { limitsByPlan } from "@/lib/limits";
import type { PlanKey } from "@/lib/limits";
import {
  canConsumeMonthlyMinutes,
  consumeMonthlyMinutes,
  canUseFreeToday,
  consumeFreeToday,
} from "@/lib/usage/usage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    /* =========================
       BODY
    ========================= */
    const body = await req.json().catch(() => null);
    const key = body?.key;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing audio key" }, { status: 400 });
    }

    if (!key.startsWith(`uploads/${userId}/`)) {
      return NextResponse.json({ error: "Invalid audio key" }, { status: 403 });
    }

    /* =========================
       PLAN / LIMITS
    ========================= */
    const plan = (await getUserPlan(userId)) as PlanKey;
    const limits = limitsByPlan[plan];

    /* =========================
       CARD REQUIRED (PLUS / PRO)
    ========================= */
    if (plan !== "free") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      });

      let hasCard = false;

      if (user?.stripeCustomerId) {
        const { stripe } = await import("@/lib/stripe");

        const pms = await stripe.paymentMethods.list({
          customer: user.stripeCustomerId,
          type: "card",
          limit: 1,
        });

        hasCard = pms.data.length > 0;
      }

      if (!hasCard) {
        return NextResponse.json(
          {
            code: "CARD_REQUIRED",
            message: "Please add a payment method to continue.",
          },
          { status: 402 }
        );
      }
    }

    /* =========================
       TRANSCRIPTION (SOURCE OF TRUTH)
    ========================= */
    const { transcript, durationSec } = await transcribeFromR2(key);

    /* =========================
       MINIMUM / MAX DURATION
    ========================= */
    const minSeconds = Number(process.env.MIN_AUDIO_SECONDS ?? 8);
    const minTranscriptChars = Number(process.env.MIN_TRANSCRIPT_CHARS ?? 80);

    if (
      durationSec < minSeconds ||
      transcript.trim().length < minTranscriptChars
    ) {
      return NextResponse.json(
        {
          code: "AUDIO_TOO_SHORT",
          message: "Audio too short to generate a useful report.",
          durationSec,
        },
        { status: 422 }
      );
    }

    if (durationSec > limits.maxSeconds) {
      return NextResponse.json(
        {
          code: "AUDIO_TOO_LONG",
          message: `Your plan allows up to ${Math.round(
            limits.maxSeconds / 60
          )} minutes per audio.`,
          durationSec,
        },
        { status: 422 }
      );
    }

    /* =========================
       USAGE GUARDS
    ========================= */
    const minutesToConsume = Math.ceil(durationSec / 60);

    if (plan === "free") {
      const free = await canUseFreeToday(userId);
      if (!free.ok) {
        return NextResponse.json(
          {
            code: "DAILY_LIMIT_REACHED",
            message: "Daily free limit reached. Try again tomorrow or upgrade.",
          },
          { status: 429 }
        );
      }
    }

    const monthly = await canConsumeMonthlyMinutes({
      userId,
      plan,
      minutesToConsume,
    });

    if (!monthly.ok) {
      return NextResponse.json(
        {
          code: "MONTHLY_LIMIT_REACHED",
          message: "Monthly minute limit reached.",
          remainingMinutes: monthly.remaining,
        },
        { status: 429 }
      );
    }

    /* =========================
       GENERATE REPORT
    ========================= */
    const result = await generateReport(transcript);

    /* =========================
       SAVE REPORT
    ========================= */
    const report = await prisma.analysisReport.create({
      data: {
        userId,
        audioKey: key,
        status: "done",
        durationSec,
        reportFull: JSON.stringify(result.fullText),
        reportFree: JSON.stringify(result.freeText),
        transcript,
      },
    });

    /* =========================
       CONSUME USAGE
    ========================= */
    await consumeMonthlyMinutes({ userId, minutesToConsume });
    if (plan === "free") {
      await consumeFreeToday(userId);
    }

    return NextResponse.json({
      id: report.id,
      isPro: plan !== "free",
    });
  } catch (err) {
    console.error("❌ analyze error", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
