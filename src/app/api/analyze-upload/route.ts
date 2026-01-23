import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { toFile } from "openai/uploads";
import { VIRAL_PROMPT } from "@/lib/prompts/viralPrompt";
import { limitsByPlan, type PlanKey } from "@/lib/limits";
import { getAudioDurationSeconds } from "@/lib/audio/getDuration";
import { cutAudio } from "@/lib/audio/cutAudio";
import { normalizeAudio } from "@/lib/audio/normalizeAudio";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { pipeline } from "stream/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// TODO: auth real
import { getUserPlan } from "@/lib/auth/getUserPlan";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function makeFreePreview(full: string) {
  // separa por títulos tipo "SUMMARY", "VIRAL REASON", etc
  const sections = full.split(/\n(?=[A-Z][A-Z\s]+:?\n)/);

  return sections
    .map((section, index) => {
      const [titleLine, ...contentLines] = section.split("\n");
      const content = contentLines.join("\n").trim();

      // primeras 3 secciones → completas
      if (index < 3) {
        return section.trim();
      }

      // resto → solo preview
      const previewLength = Math.max(120, Math.floor(content.length * 0.35));

      return (
        `${titleLine}\n` +
        content.slice(0, previewLength).trim() +
        "\n\n🔒 Upgrade to unlock the full section."
      );
    })
    .join("\n\n");
}

export async function POST(req: Request) {
  let key: string | undefined;
  let reportRecord: { id: string } | null = null;

  let inputPath: string | null = null;
  let finalPath: string | null = null;
  let normalizedPath: string | null = null;

  try {
    const body = await req.json().catch(() => null);
    key = body?.key;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

   const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const userId = session.user.id;

await prisma.user.upsert({
  where: { id: userId },
  update: {},
  create: {
    id: userId,
    plan: "free",
  },
});
    
    const plan = (await getUserPlan(userId)) as PlanKey;
    const limits = limitsByPlan[plan];

    // 1) Download audio from R2
    const obj = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      })
    );

    if (!obj.Body) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    const ext = path.extname(key) || ".bin";
    inputPath = path.join("/tmp", `${crypto.randomUUID()}${ext}`);
    await pipeline(obj.Body as any, fs.createWriteStream(inputPath));

    // 2) Duration
    const duration = await getAudioDurationSeconds(inputPath);

    // 3) Trim logic
    finalPath = inputPath;
    let wasTrimmed = false;

    if (duration > limits.maxSeconds) {
      if (limits.behavior === "trim") {
        const cutPath = path.join("/tmp", `${crypto.randomUUID()}_cut${ext}`);
        await cutAudio(inputPath, cutPath, limits.maxSeconds);
        finalPath = cutPath;
        wasTrimmed = true;
      } else {
        return NextResponse.json(
          { error: "AUDIO_TOO_LONG" },
          { status: 402 }
        );
      }
    }

    const userExists = await prisma.user.findUnique({
  where: { id: userId },
});

console.log("USER EXISTS?", userExists);


    // 4) Create report (processing)
    reportRecord = await prisma.analysisReport.create({
      data: {
        userId,
        audioKey: key,
        status: "processing",
        durationSec: Math.round(duration),
        wasTrimmed,
      },
    });

  
    // 5) Normalize
    normalizedPath = path.join(
      "/tmp",
      `${crypto.randomUUID()}_normalized.mp3`
    );
    await normalizeAudio(finalPath, normalizedPath);

    // 6) Transcribe
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

    // 7) Analyze
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: VIRAL_PROMPT },
        { role: "user", content: transcriptText },
      ],
    });

    const report = completion.choices[0]?.message?.content ?? "";

    // 8) Save result
    await prisma.analysisReport.update({
      where: { id: reportRecord!.id },
      data: {
        status: "done",
        transcript: transcriptText,
        reportFull: report,
        reportFree: makeFreePreview(report),
      },
    });

    return NextResponse.json({ reportId: reportRecord!.id });
  } catch (err: any) {
    if (reportRecord?.id) {
      await prisma.analysisReport.update({
        where: { id: reportRecord!.id },
        data: { status: "error" },
      });
    }

    return NextResponse.json(
      { error: err?.message || "Analyze failed" },
      { status: 500 }
    );
  } finally {
    if (key) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
          })
        );
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
