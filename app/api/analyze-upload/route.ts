import { NextResponse } from "next/server";
import OpenAI from "openai";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";
import { parseViralReport } from "@/lib/report/parseReport";
import { buildReportForUser } from "@/lib/report/buildReportForUser";
import { getOrCreateUser } from "@/lib/user";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function getMaxDurationSeconds(plan: "free" | "pro") {
  return plan === "free" ? 180 : 1200;
}

export async function POST(req: Request) {
  try {
    /* ================= USER ================= */
    const user = await getOrCreateUser();
    const cardOnFile = Boolean(user.stripeCustomerId);

    // 🔒 FREE sin tarjeta
    if (user.plan === "free" && !cardOnFile) {
      return NextResponse.json(
        { error: "CARD_REQUIRED" },
        { status: 403 }
      );
    }

    const maxAllowed = getMaxDurationSeconds(user.plan);

    /* ================= FILE ================= */
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "NO_FILE" },
        { status: 400 }
      );
    }

    /* ================= TRANSCRIPTION ================= */
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "gpt-4o-mini-transcribe",
      response_format: "verbose_json",
    });

    const transcript = transcription.text;

    let durationSeconds = maxAllowed;

    if (
      Array.isArray(transcription.segments) &&
      transcription.segments.length > 0
    ) {
      durationSeconds = Math.ceil(
        transcription.segments[transcription.segments.length - 1].end
      );
    }

    if (durationSeconds > maxAllowed) {
      return NextResponse.json(
        {
          error: "DURATION_LIMIT_EXCEEDED",
          maxAllowed,
          actual: durationSeconds,
        },
        { status: 403 }
      );
    }

    /* ================= ANALYSIS ================= */
    const analysisResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: VIRAL_PROMPT },
        { role: "user", content: transcript },
      ],
    });

    const raw =
      analysisResponse.output_text ||
      "Analysis could not be generated.";

    const fullReport = parseViralReport(raw);
    const reportForUser = buildReportForUser(
      fullReport,
      user.plan
    );

    return NextResponse.json({
      transcript: user.plan === "pro" ? transcript : undefined,
      report: reportForUser,
    });
  } catch (error) {
    console.error("ANALYZE_UPLOAD_ERROR:", error);
    return NextResponse.json(
      { error: "ANALYSIS_FAILED" },
      { status: 500 }
    );
  }
}
