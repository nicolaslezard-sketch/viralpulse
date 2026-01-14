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

/* ================= TYPES ================= */
type Plan = "free" | "pro";

function normalizePlan(plan: string): Plan {
  return plan === "pro" ? "pro" : "free";
}

function getMaxDurationSeconds(plan: Plan) {
  return plan === "free" ? 180 : 1200;
}

/* ================= ROUTE ================= */
export async function POST(req: Request) {
  try {
    /* ================= USER ================= */
    const user = await getOrCreateUser();
    const plan = normalizePlan(user.plan);
    const cardOnFile = Boolean(user.stripeCustomerId);

    // 🔒 FREE sin tarjeta → Stripe
    if (plan === "free" && !cardOnFile) {
      return NextResponse.json(
        { error: "CARD_REQUIRED" },
        { status: 403 }
      );
    }

    const maxAllowed = getMaxDurationSeconds(plan);

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

    if (!transcription || !("text" in transcription)) {
      return NextResponse.json(
        { error: "TRANSCRIPTION_FAILED" },
        { status: 500 }
      );
    }

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

    // 🔒 Límite por plan
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
      analysisResponse.output_text ??
      "Analysis could not be generated.";

    const fullReport = parseViralReport(raw);
    const reportForUser = buildReportForUser(
      fullReport,
      plan
    );

    return NextResponse.json({
      transcript: plan === "pro" ? transcript : undefined,
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
