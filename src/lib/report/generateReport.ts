import { getOpenAIClient } from "@/lib/openai";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";

export type GenerateReportResult = {
  fullText: string;
  freeText: string;
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

let raw = completion.choices[0]?.message?.content ?? "";

// 🔧 Normalize report text for frontend parser
raw = raw
  // remove instruction separators
  .replace(/=+/g, "")
  // normalize line endings
  .replace(/\r\n/g, "\n")
  // trim leading/trailing whitespace
  .trim();

  // 👉 Free = primeros 3 bloques completos + resto truncado
  const sections = raw.split(/\n\s*\n/);

  const freeText =
    sections.slice(0, 3).join("\n\n") +
    "\n\n🔒 Upgrade to Pro to unlock the full analysis.";

  return {
    fullText: raw.trim(),
    freeText: freeText.trim(),
    transcript,
    durationSec: Math.floor(transcript.length / 4), // OK por ahora
  };
}
