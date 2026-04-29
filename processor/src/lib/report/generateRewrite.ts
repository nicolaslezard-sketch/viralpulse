import { getOpenAIClient } from "../openai";
import { VIRAL_REWRITE_PROMPT } from "../prompts/rewritePrompt";
import type { FullReport } from "./types";

export type RewriteResult = {
  hookRewrite: string;
  optimizedScript: string;
  titles: string[];
  thumbnailIdea: string;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseRewrite(raw: string): RewriteResult | null {
  try {
    const parsed = JSON.parse(raw) as Partial<RewriteResult>;

    return {
      hookRewrite:
        typeof parsed.hookRewrite === "string" ? parsed.hookRewrite : "",
      optimizedScript:
        typeof parsed.optimizedScript === "string" ? parsed.optimizedScript : "",
      titles: isStringArray(parsed.titles) ? parsed.titles : [],
      thumbnailIdea:
        typeof parsed.thumbnailIdea === "string" ? parsed.thumbnailIdea : "",
    };
  } catch {
    return null;
  }
}

export async function generateRewrite({
  transcript,
  report,
}: {
  transcript: string;
  report: FullReport | Record<string, unknown>;
}): Promise<RewriteResult | null> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.8,
    messages: [
      { role: "system", content: VIRAL_REWRITE_PROMPT },
      {
        role: "user",
        content: `
TRANSCRIPT
${transcript}

ANALYSIS
${JSON.stringify(report)}
`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return parseRewrite(raw);
}
