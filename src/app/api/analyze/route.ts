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
    const mimeType = body?.mimeType;
    const sourceType = body?.sourceType;
    const originalNameFromClient = body?.originalName ?? null;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing media key" }, { status: 400 });
    }

    if (!mimeType || typeof mimeType !== "string") {
      return NextResponse.json({ error: "Missing mimeType" }, { status: 400 });
    }

    if (!key.startsWith(`uploads/${userId}/`)) {
      return NextResponse.json({ error: "Invalid media key" }, { status: 403 });
    }

    /* =========================
       PLAN
    ========================= */
    const plan = (await getUserPlan(userId)) as PlanKey;
    const limits = limitsByPlan[plan];

    /* =========================
       TRANSCRIBE (VIDEO OR AUDIO)
    ========================= */
    const { transcript, durationSec } = await transcribeFromR2(key, mimeType);

    /* =========================
       MINIMUM AUDIO GUARD
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
          message: "Content too short to generate a useful report.",
          durationSec,
        },
        { status: 422 },
      );
    }

    /* =========================
       PLAN MAX DURATION
    ========================= */
    if (durationSec > limits.maxSeconds) {
      return NextResponse.json(
        {
          code: "VIDEO_TOO_LONG",
          message: `Your plan allows up to ${Math.round(
            limits.maxSeconds / 60,
          )} minutes per video.`,
          durationSec,
        },
        { status: 422 },
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
            message:
              "You’ve used your free analyses today. Try again tomorrow or upgrade.",
          },
          { status: 429 },
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
        { status: 429 },
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

        sourceType: sourceType ?? "audio",
        mimeType,

        mediaKey: key,

        originalName: originalNameFromClient?.slice(0, 120) ?? null,

        status: "done",

        durationSec,

        reportFull: result.fullText,
        reportFree: result.freeText,
        transcript,

        viralScore: result.viralScore,
        viralMetrics: result.viralMetrics ?? undefined,
      },
    });

    /* =========================
       CONSUME USAGE
    ========================= */
    await consumeMonthlyMinutes({
      userId,
      minutesToConsume,
    });

    if (plan === "free") {
      await consumeFreeToday(userId);
    }

    return NextResponse.json({
      id: report.id,
      isPro: plan !== "free",
    });
  } catch (err) {
    console.error("❌ analyze error", err);

    return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
  }
}
