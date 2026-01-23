import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { r2 } from "@/lib/r2";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { toFile } from "openai/uploads";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";
import { limitsByPlan, type PlanKey } from "@/lib/limits";
import { getAudioDurationSeconds } from "@/lib/audio/getDuration";
import { cutAudio } from "@/lib/audio/cutAudio";
import { normalizeAudio } from "@/lib/audio/normalizeAudio";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { pipeline } from "stream/promises";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function makeFreePreview(full: string) {
  const sections = full.split(/\n(?=[A-Z][A-Z\s]+:?\n)/);

  return sections
    .map((section, index) => {
      const [titleLine, ...contentLines] = section.split("\n");
      const content = contentLines.join("\n").trim();

      if (index < 3) return section.trim();

      const previewLength = Math.max(120, Math.floor(content.length * 0.35));

      return (
        `${titleLine}\n` +
        content.slice(0, previewLength).trim() +
        "\n\n🔒 Upgrade to unlock the full section."
      );
    })
    .join("\n\n");
}

export const analyzeReport = inngest.createFunction(
  {
    id: "analyze-report",
    retries: 2,
  },
  { event: "report/analyze" },
  async ({ event }) => {
    const { reportId } = event.data;

    let inputPath: string | null = null;
    let finalPath: string | null = null;
    let normalizedPath: string | null = null;

    const report = await prisma.analysisReport.findUnique({
      where: { id: reportId },
      include: { user: true },
    });

if (!report) {
  throw new Error("REPORT_NOT_FOUND_YET");
}

    const userId = report.userId;
    const key = report.audioKey;

    try {
      const plan = report.user.plan as PlanKey;
      const limits = limitsByPlan[plan];

      // 1) Download audio
      const obj = await r2.send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
        })
      );

      if (!obj.Body) throw new Error("Audio not found");

      const ext = path.extname(key) || ".bin";
      inputPath = path.join("/tmp", `${crypto.randomUUID()}${ext}`);
      await pipeline(obj.Body as any, fs.createWriteStream(inputPath));

      // 2) Duration
      const duration = await getAudioDurationSeconds(inputPath);

      // 3) Trim
      finalPath = inputPath;
      let wasTrimmed = false;

      if (duration > limits.maxSeconds) {
        if (limits.behavior === "trim") {
          const cutPath = path.join(
            "/tmp",
            `${crypto.randomUUID()}_cut${ext}`
          );
          await cutAudio(inputPath, cutPath, limits.maxSeconds);
          finalPath = cutPath;
          wasTrimmed = true;
        } else {
          throw new Error("AUDIO_TOO_LONG");
        }
      }

      // 4) Normalize
      normalizedPath = path.join(
        "/tmp",
        `${crypto.randomUUID()}_normalized.mp3`
      );
      await normalizeAudio(finalPath, normalizedPath);

      // 5) Transcribe
      const buffer = await fsp.readFile(normalizedPath);
      const audioFile = await toFile(buffer, "audio.mp3");

      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "gpt-4o-mini-transcribe",
        response_format: "text",
      });

      const transcriptText =
        typeof transcription === "string"
          ? transcription
          : (transcription as any).text || "";

      // 6) Analyze
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: VIRAL_PROMPT },
          { role: "user", content: transcriptText },
        ],
      });

      const reportText = completion.choices[0]?.message?.content ?? "";

      // 7) Save
      await prisma.analysisReport.update({
        where: { id: reportId },
        data: {
          status: "done",
          transcript: transcriptText,
          reportFull: reportText,
          reportFree: makeFreePreview(reportText),
          durationSec: Math.round(duration),
          wasTrimmed,
        },
      });
    } catch (err) {
      await prisma.analysisReport.update({
        where: { id: reportId },
        data: { status: "error" },
      });
      throw err;
    } finally {
      if (key) {
        try {
          const expectedPrefix = `uploads/${userId}/`;
          if (key.startsWith(expectedPrefix)) {
            await r2.send(
              new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: key,
              })
            );
          }
        } catch {}
      }

      for (const p of [normalizedPath, finalPath, inputPath]) {
        if (p) {
          try {
            await fsp.unlink(p);
          } catch {}
        }
      }
    }
  }
);
