import { getOpenAIClient } from "../openai";
import { ViralReportJsonSchema } from "./schema";
import { toFullReport } from "./toFullReport";
import { buildReportForUser } from "./buildReportForUser";
import type { FullReport } from "./types";
import { VIRAL_PROMPT_JSON } from "../prompts/viralPrompt";

export type GenerateReportResult = {
  fullText: FullReport;
  freeText: FullReport;
  transcript: string;
  durationSec: number;
  viralScore: number | null;
  viralMetrics: {
    hookStrength: number;
    retentionPotential: number;
    emotionalImpact: number;
    shareability: number;
    finalScore: number;
  } | null;
};

export async function generateReport(
  transcript: string,
): Promise<GenerateReportResult> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: VIRAL_PROMPT_JSON },
      { role: "user", content: transcript },
    ],
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON returned by model");
  }

  const parsed = ViralReportJsonSchema.safeParse(json);
  if (!parsed.success) {
    // Acá no hacemos “parche”: fallamos fuerte para no guardar basura.
    // Como no tenés usuarios, mejor romper temprano.
    throw new Error("Model JSON does not match expected schema");
  }

  const fullReport = toFullReport(parsed.data);
  const freeReport = buildReportForUser(fullReport, "free");

  return {
    fullText: fullReport,
    freeText: freeReport,
    transcript,
    durationSec: Math.floor(transcript.length / 4), // esto lo podés mejorar luego
    viralScore: parsed.data.metrics.finalScore,
    viralMetrics: parsed.data.metrics,
  };
}
