import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export const runtime = "nodejs";

/* =========================
   CONFIG MVP (ajustable)
========================= */

const MAX_TRANSCRIPT_CHARS = 9000; // control fuerte de costos
const MIN_TRANSCRIPT_CHARS = 120;

/* =========================
   HELPERS
========================= */

function extractYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex !== -1 && parts[shortsIndex + 1])
        return parts[shortsIndex + 1];
    }

    return null;
  } catch {
    return null;
  }
}

function smartTruncate(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const slice = Math.floor(maxChars / 3);

  const start = text.slice(0, slice);
  const middle = text.slice(
    Math.floor(text.length / 2 - slice / 2),
    Math.floor(text.length / 2 + slice / 2)
  );
  const end = text.slice(text.length - slice);

  return `${start}\n...\n${middle}\n...\n${end}`;
}

function enforceStructure(raw: string) {
  const sections = [
    "1) SUMMARY",
    "2) VIRAL REASON",
    "3) KEY MOMENT",
    "4) TITLE IDEAS",
    "5) HASHTAGS",
    "6) REMIX IDEAS",
    "7) REACTION SCRIPT",
    "8) MEME TEMPLATES",
    "9) HOOKS",
    "10) PREDICTED LONGEVITY",
  ];

  let output = raw;

  for (const section of sections) {
    if (!output.includes(section)) {
      output += `\n\n${section}\n(Not provided by model)`;
    }
  }

  return output.trim();
}

/* =========================
   PROMPT
========================= */

const MASTER_PROMPT_ES = `
Eres un “Viral Content Intelligence Engine”, especializado en analizar videos de redes sociales.

IMPORTANTE:
- La salida debe ser SIEMPRE en inglés.
- Usa EXACTAMENTE las 10 secciones solicitadas.
- No inventes datos.
- Sé claro, accionable y experto.

Estructura obligatoria:
1) SUMMARY
2) VIRAL REASON
3) KEY MOMENT
4) TITLE IDEAS
5) HASHTAGS
6) REMIX IDEAS
7) REACTION SCRIPT
8) MEME TEMPLATES
9) HOOKS
10) PREDICTED LONGEVITY
`;

/* =========================
   HANDLER
========================= */

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid URL." },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Only YouTube links are supported in this MVP." },
        { status: 400 }
      );
    }

    // Transcript
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch {
      return NextResponse.json(
        {
          error:
            "Transcript unavailable. Video may be private, age-restricted, or subtitles disabled.",
        },
        { status: 422 }
      );
    }

    const transcriptRaw = transcriptItems
      .map((x: { text: string }) => x.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (transcriptRaw.length < MIN_TRANSCRIPT_CHARS) {
      return NextResponse.json(
        { error: "Transcript too short to analyze meaningfully." },
        { status: 422 }
      );
    }

    const transcript = smartTruncate(transcriptRaw, MAX_TRANSCRIPT_CHARS);

    // Debug / costos
    console.log("[ViralPulse]", {
      videoId,
      charsSent: transcript.length,
      approxTokens: Math.round(transcript.length / 4),
    });

    const input = `
Platform: YouTube
Transcript:
${transcript}
    `.trim();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing API key." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: MASTER_PROMPT_ES },
          { role: "user", content: input },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "AI analysis failed.", details: text.slice(0, 300) },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawOutput =
      typeof data?.output_text === "string"
        ? data.output_text
        : "No output generated.";

    const analysis = enforceStructure(rawOutput);

    return NextResponse.json({
      platform: "youtube",
      videoId,
      analysis,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
