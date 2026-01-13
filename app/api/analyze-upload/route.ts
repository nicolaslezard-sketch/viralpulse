import { NextResponse } from "next/server";
import OpenAI from "openai";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* ======================================================
   TEMPORAL: luego se reemplaza por Auth + DB real
====================================================== */
async function getUserFromSession() {
  return {
    id: "user_1",
    plan: "free" as "free" | "pro",
    cardOnFile: false,
    freeUsedToday: false,
  };
}

function getMaxDurationSeconds(plan: "free" | "pro") {
  return plan === "free" ? 180 : 1200;
}

export async function POST(req: Request) {
  try {
    /* ======================================================
       0) USER + GATING (SIEMPRE PRIMERO)
    ====================================================== */
    const user = await getUserFromSession();

    // 🔒 FREE sin tarjeta
    if (user.plan === "free" && !user.cardOnFile) {
      return NextResponse.json(
        { error: "CARD_REQUIRED" },
        { status: 403 }
      );
    }

    // 🔒 validar duración según plan
const maxAllowed = getMaxDurationSeconds(user.plan);

    // 🔒 FREE ya usó el análisis diario
    if (user.plan === "free" && user.freeUsedToday) {
      return NextResponse.json(
        { error: "FREE_LIMIT_REACHED" },
        { status: 403 }
      );
    }

    /* ======================================================
       1) FILE VALIDATION
    ====================================================== */
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "NO_FILE" },
        { status: 400 }
      );
    }

    // 👉 TODO (próximo paso):
    // - validar duración real del archivo
    // - Free: max 180s
    // - Pro: max 1200s

    /* ======================================================
       2) TRANSCRIPTION (WHISPER)
    ====================================================== */
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

// ⏱️ calcular duración real
let durationSeconds = 0;

// fallback defensivo
if (!Array.isArray(transcription.segments)) {
  durationSeconds = maxAllowed;
}

if (
  Array.isArray(transcription.segments) &&
  transcription.segments.length > 0
) {
  const lastSegment =
    transcription.segments[transcription.segments.length - 1];
  durationSeconds = Math.ceil(lastSegment.end);
}

// 🔒 validar duración según plan
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

    /* ======================================================
       3) ANALYSIS (RAW)
    ====================================================== */
    const analysisResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: VIRAL_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    });

    const raw =
      analysisResponse.output_text ||
      "Analysis could not be generated.";

    /* ======================================================
       4) SUCCESS RESPONSE
    ====================================================== */
    return NextResponse.json({
      transcript,
      raw,
    });
  } catch (error) {
    console.error("ANALYZE_UPLOAD_ERROR:", error);
    return NextResponse.json(
      { error: "ANALYSIS_FAILED" },
      { status: 500 }
    );
  }
}
