import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { limitsByPlan } from "@/lib/limits";
import type { PlanKey } from "@/lib/limits";
import {
  canConsumeMonthlyMinutes,
  consumeMonthlyMinutes,
  canUseFreeToday,
  consumeFreeToday,
} from "@/lib/usage/usage";
import { runAnalysis } from "@/lib/analysis/runAnalysis";
import { transcribeFromR2 } from "@/lib/analysis/transcribeFromR2";

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
    const fileSize = body?.fileSize ?? null;

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
       PRE-FLIGHT MEDIA CHECK
       Necesitamos duración real para:
       - min guard
       - max per plan
       - usage minutes
    ========================= */
    const { transcript, durationSec } = await transcribeFromR2(key, mimeType);

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
       CREATE REPORT FIRST
    ========================= */
    const report = await prisma.analysisReport.create({
      data: {
        userId,
        sourceType: sourceType ?? "audio",
        mimeType,
        fileSize: typeof fileSize === "number" ? fileSize : null,
        mediaKey: key,
        originalName: originalNameFromClient?.slice(0, 120) ?? null,
        status: "processing",
      },
      select: { id: true },
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

    /* =========================
       RUN ANALYSIS
       Por ahora sync para dejarlo simple y testeable.
    ========================= */
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        transcript,
        durationSec,
      },
    });

    await runAnalysis({ reportId: report.id });

    return NextResponse.json({
      id: report.id,
      isPro: plan !== "free",
    });
  } catch (err) {
    console.error("❌ analyze error", err);
    return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
  }
}
