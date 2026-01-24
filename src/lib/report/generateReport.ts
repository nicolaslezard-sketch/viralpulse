import { parseViralReport } from "./parseReport";
import { buildReportForUser } from "./buildReportForUser";
import { getOpenAIClient } from "@/lib/openai";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";

export type GenerateReportResult = {
  full: any;
  free: any;
  transcript: string;
  durationSec: number;
};

export async function generateReport(
  transcript: string
): Promise<GenerateReportResult> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: VIRAL_PROMPT },
      { role: "user", content: transcript },
    ],
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  const parsed = parseViralReport(raw);
  const freeVersion = buildReportForUser(parsed, "free");

  return {
    full: parsed,
    free: freeVersion,
    transcript,
    durationSec: Math.floor(transcript.length / 4), // placeholder OK
  };
}
