import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export const runtime = "nodejs";

type HookAnalyzerResponse = {
  score: number;
  mainIssue: string;
  whyPeopleMaySkip: string;
  betterHook: string;
  rewrittenScript: string;
  titleIdeas: string[];
  ctaSuggestion: string;
  platformAdvice: string;
};

const PLATFORM_OPTIONS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Podcast Clip",
  "LinkedIn Video",
] as const;

function clampScore(value: unknown) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeResult(value: unknown): HookAnalyzerResponse {
  const data =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  return {
    score: clampScore(data.score),
    mainIssue:
      typeof data.mainIssue === "string"
        ? data.mainIssue
        : "The opening does not create enough immediate tension.",
    whyPeopleMaySkip:
      typeof data.whyPeopleMaySkip === "string"
        ? data.whyPeopleMaySkip
        : "The viewer may not understand quickly enough why they should keep watching.",
    betterHook:
      typeof data.betterHook === "string"
        ? data.betterHook
        : "Start with a sharper claim, problem or surprising result.",
    rewrittenScript:
      typeof data.rewrittenScript === "string"
        ? data.rewrittenScript
        : "",
    titleIdeas: isStringArray(data.titleIdeas) ? data.titleIdeas.slice(0, 5) : [],
    ctaSuggestion:
      typeof data.ctaSuggestion === "string"
        ? data.ctaSuggestion
        : "Ask the viewer to comment, save or try the idea.",
    platformAdvice:
      typeof data.platformAdvice === "string"
        ? data.platformAdvice
        : "Make the first line clearer, faster and more specific.",
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      script?: unknown;
      platform?: unknown;
      goal?: unknown;
    } | null;

    const script = typeof body?.script === "string" ? body.script.trim() : "";
    const platform =
      typeof body?.platform === "string" &&
      PLATFORM_OPTIONS.includes(body.platform as (typeof PLATFORM_OPTIONS)[number])
        ? body.platform
        : "TikTok";
    const goal = typeof body?.goal === "string" ? body.goal.trim() : "grow audience";

    if (script.length < 20) {
      return NextResponse.json(
        { error: "Please enter at least 20 characters." },
        { status: 400 },
      );
    }

    if (script.length > 4000) {
      return NextResponse.json(
        { error: "Please keep the script under 4,000 characters." },
        { status: 400 },
      );
    }

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.75,
      messages: [
        {
          role: "system",
          content: `
You are ViralPulse, an expert short-form content strategist.

Analyze a user's hook, idea or script before they publish.

Return ONLY valid JSON with this exact shape:
{
  "score": number,
  "mainIssue": string,
  "whyPeopleMaySkip": string,
  "betterHook": string,
  "rewrittenScript": string,
  "titleIdeas": string[],
  "ctaSuggestion": string,
  "platformAdvice": string
}

Rules:
- Be direct and practical.
- Score must be 0 to 100.
- Improve retention in the first 3 seconds.
- Do not be generic.
- Keep the rewritten script concise and publishable.
- Optimize for the selected platform.
`.trim(),
        },
        {
          role: "user",
          content: `
Platform: ${platform}
Goal: ${goal}

Script / idea:
${script}
`.trim(),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as unknown;

    return NextResponse.json(normalizeResult(parsed));
  } catch (err) {
    console.error("Hook analyzer failed", err);
    return NextResponse.json(
      { error: "Could not analyze this script right now." },
      { status: 500 },
    );
  }
}
