import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { transcribeFromR2 } from "@/lib/analysis/transcribeFromR2";
import { generateReport } from "@/lib/report/generateReport";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { limitsByPlan } from "@/lib/limits";
import type { PlanKey } from "@/lib/limits";

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
      return NextResponse.json(
        { error: "Missing audio key" },
        { status: 400 }
      );
    }

    // seguridad: el audio debe ser del usuario
    if (!key.startsWith(`uploads/${userId}/`)) {
      return NextResponse.json(
        { error: "Invalid audio key" },
        { status: 403 }
      );
    }

    /* =========================
       PLAN / LIMITS
    ========================= */
    const plan = (await getUserPlan(userId)) as PlanKey;
    const limits = limitsByPlan[plan];

    /* =========================
       TRANSCRIPTION
    ========================= */
    const { transcript, durationSec } = await transcribeFromR2(key);

    /* =========================
       MINIMUM DURATION / CONTENT
    ========================= */
    const minSeconds = Number(process.env.MIN_AUDIO_SECONDS ?? 8);
    const minTranscriptChars = Number(process.env.MIN_TRANSCRIPT_CHARS ?? 80);

    const cleanTranscript = (transcript ?? "").trim();

    if ((durationSec ?? 0) < minSeconds || cleanTranscript.length < minTranscriptChars) {
      return NextResponse.json(
        {
          code: "AUDIO_TOO_SHORT",
          message: `Audio too short to generate a useful report. Please upload at least ${minSeconds}s.`,
          durationSec,
        },
        { status: 422 }
      );
    }


    if (durationSec > limits.maxSeconds) {
      return NextResponse.json(
        {
          error: `Audio too long for ${plan} plan`,
          durationSec,
        },
        { status: 400 }
      );
    }

    /* =========================
       GENERATE REPORT
    ========================= */
    const result = await generateReport(transcript);

    /* =========================
       SAVE (PRISMA SAFE)
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

return NextResponse.json({
  id: report.id,        // 🔥 CLAVE
  isPro: plan === "pro",
});



  } catch (err) {
    console.error("❌ analyze error", err);

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
