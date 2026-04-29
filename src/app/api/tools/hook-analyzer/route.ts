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
You are ViralPulse, a sharp short-form content strategist for creators.

Your job is to make the user's hook and script more specific, more watchable and more likely to retain attention in the first 3 seconds.

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

Scoring rules:
- 90-100: extremely strong, specific, curiosity-driven and immediately engaging.
- 75-89: good idea, but still needs sharper tension or faster setup.
- 55-74: useful content, weak opening or too much context.
- 30-54: generic, slow, unclear or low-retention.
- 0-29: very weak or confusing.
Do not over-score. If the first sentence is slow, generic or explanatory, score below 75.

Output rules:
- Be specific to the user's script. Do not give generic advice.
- Do not say "use engaging visuals", "quick cuts", or "text overlays" unless you describe exactly what should appear.
- The betterHook must be one strong opening line, max 18 words.
- The rewrittenScript must preserve the user's core idea, but make it faster and punchier.
- The rewrittenScript should be 90-160 words unless the input is very short.
- Title ideas must be specific, not generic motivational titles.
- Platform advice must include one concrete format recommendation for the selected platform, written as a short execution plan with 3 numbered steps.
- For TikTok, YouTube Shorts and Instagram Reels, include what should happen in the first 2 seconds, what text should appear on screen, and how to end the video.
- CTA suggestion must be specific to the user's topic. Avoid generic CTAs like "follow for more tips".
- Use direct, plain English. No corporate tone.
- Avoid clickbait unless it is supported by the content.
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
