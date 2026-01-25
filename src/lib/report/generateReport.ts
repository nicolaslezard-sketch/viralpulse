import { parseViralReport } from "./parseReport";
import { buildReportForUser } from "./buildReportForUser";
import { getOpenAIClient } from "@/lib/openai";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";
import type { FullReport } from "./types";


export type GenerateReportResult = {
  fullText: FullReport;
  freeText: FullReport;
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

  // ✅ nombres reales y consistentes
  const parsedReport = parseViralReport(raw);
  const freeReport = buildReportForUser(parsedReport, "free");

  return {
    fullText: parsedReport,
    freeText: freeReport,
    transcript,
    durationSec: Math.floor(transcript.length / 4),
  };
}
