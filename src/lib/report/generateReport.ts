import { getOpenAIClient } from "@/lib/openai";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";
import { splitReportByTitle } from "./splitReportByTitle";

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

  // limpieza mínima
  raw = raw.replace(/=+/g, "").replace(/\r\n/g, "\n").trim();

  const sections = splitReportByTitle(raw);

  const freeSections = sections.map((section, index) => {
  // primeros 3 completos
  if (index < 3) {
    return `${section.title}\n${section.content}`;
  }

  // resto truncado
  const lines = section.content.split("\n").filter(Boolean);
  const keepCount = Math.max(1, Math.floor(lines.length * 0.35));

  const preview = lines.slice(0, keepCount).join("\n");

  return (
    `${section.title}\n` +
    `${preview}\n\n` +
    `🔒 Upgrade to Pro to unlock the full section.`
  );
});


  return {
    fullText: raw,
    freeText: freeSections.join("\n\n"),
    transcript,
    durationSec: Math.floor(transcript.length / 4),
  };
}
