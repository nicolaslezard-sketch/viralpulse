import { getOpenAIClient } from "@/lib/openai";
import { VIRAL_REWRITE_PROMPT } from "@/lib/prompts/rewritePrompt";

export type RewriteResult = {
  hookRewrite: string;
  optimizedScript: string;
  titles: string[];
  thumbnailIdea: string;
};

export async function generateRewrite({
  transcript,
  report,
}: {
  transcript: string;
  report: any;
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

  try {
    const parsed = JSON.parse(raw);

    return {
      hookRewrite: parsed.hookRewrite ?? "",
      optimizedScript: parsed.optimizedScript ?? "",
      titles: parsed.titles ?? [],
      thumbnailIdea: parsed.thumbnailIdea ?? "",
    };
  } catch {
    return null;
  }
}
