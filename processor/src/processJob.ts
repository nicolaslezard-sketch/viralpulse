import "dotenv/config";
import fs from "fs";
import os from "os";
import path from "path";

import { prisma } from "./lib/prisma";
import { deleteObject } from "./deleteObject";
import { downloadToTmp } from "./downloadToTmp";
import { extractAudio } from "./extractAudio";
import { transcribeFromFile } from "./transcribeFromFile";
import { getMediaDurationSeconds } from "./getMediaDurationSeconds";
import { generateReport } from "../../src/lib/report/generateReport";
import { generateRewrite } from "../../src/lib/report/generateRewrite";

export type AnalysisJob = {
  reportId: string;
  userId: string;
  mediaKey: string;
  mimeType: string;
  sourceType: "audio" | "video";
};

export class PermanentJobError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermanentJobError";
  }
}

function isVideoMime(mimeType: string) {
  return mimeType.startsWith("video/");
}

function normalizeJob(rawJob: unknown): AnalysisJob {
  let parsed: unknown = rawJob;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new PermanentJobError(
        "Invalid job payload: body is not valid JSON string",
      );
    }
  }

  if (!parsed || typeof parsed !== "object") {
    throw new PermanentJobError("Invalid job payload: body is not an object");
  }

  const j = parsed as Record<string, unknown>;

  if (typeof j.reportId !== "string" || !j.reportId) {
    throw new PermanentJobError("Invalid job payload: missing reportId");
  }

  if (typeof j.userId !== "string" || !j.userId) {
    throw new PermanentJobError("Invalid job payload: missing userId");
  }

  if (typeof j.mediaKey !== "string" || !j.mediaKey) {
    throw new PermanentJobError("Invalid job payload: missing mediaKey");
  }

  if (typeof j.mimeType !== "string" || !j.mimeType) {
    throw new PermanentJobError("Invalid job payload: missing mimeType");
  }

  if (j.sourceType !== "audio" && j.sourceType !== "video") {
    throw new PermanentJobError("Invalid job payload: missing sourceType");
  }

  return {
    reportId: j.reportId,
    userId: j.userId,
    mediaKey: j.mediaKey,
    mimeType: j.mimeType,
    sourceType: j.sourceType,
  };
}

function isPermanentError(err: unknown) {
  return err instanceof PermanentJobError;
}

export async function processJob(rawJob: unknown) {
  const job = normalizeJob(rawJob);

  console.log("Processing job:", job.reportId, job.mediaKey, job.mimeType);

  const report = await prisma.analysisReport.findUnique({
    where: { id: job.reportId },
    select: {
      id: true,
      status: true,
      mediaKey: true,
      mimeType: true,
      sourceType: true,
      userId: true,
    },
  });

  if (!report) {
    throw new PermanentJobError(`Report not found: ${job.reportId}`);
  }

  if (report.status === "done") {
    console.log("Report already done:", report.id);
    return;
  }

  if (!report.mediaKey || !report.mimeType) {
    throw new PermanentJobError(
      `Missing mediaKey or mimeType for report ${report.id}`,
    );
  }

  const tmpDir = os.tmpdir();
  const baseName = `vp_${report.id}_${Date.now()}`;

  const mediaPath = path.join(tmpDir, `${baseName}_input`);
  const audioPath = path.join(tmpDir, `${baseName}_audio.mp3`);

  try {
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: { status: "extracting_audio" },
    });

    await downloadToTmp(report.mediaKey, mediaPath);
    console.log("Downloaded media:", mediaPath);

    let finalAudioPath = mediaPath;

    if (isVideoMime(report.mimeType)) {
      await extractAudio(mediaPath, audioPath);
      console.log("Audio extracted:", audioPath);
      finalAudioPath = audioPath;

      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    }

    const durationSec = await getMediaDurationSeconds(finalAudioPath);
    console.log("Duration detected:", durationSec);

    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "transcribing",
        durationSec,
      },
    });

    const transcript = await transcribeFromFile(finalAudioPath);
    console.log("Transcript ready, chars:", transcript.length);

    const minSeconds = Number(process.env.MIN_AUDIO_SECONDS ?? 8);
    const minTranscriptChars = Number(process.env.MIN_TRANSCRIPT_CHARS ?? 80);

    if (
      durationSec < minSeconds ||
      transcript.trim().length < minTranscriptChars
    ) {
      await prisma.analysisReport.update({
        where: { id: report.id },
        data: {
          status: "error",
          durationSec,
          transcript,
        },
      });

      throw new PermanentJobError(
        `Content too short or transcript too small for report ${report.id}`,
      );
    }

    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "analyzing",
        durationSec,
        transcript,
      },
    });

    const result = await generateReport(transcript);
    console.log("Report generated");

    const rewrite = await generateRewrite({
      transcript,
      report: result.fullText,
    });
    console.log("Rewrite generated");

    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "done",
        durationSec,
        transcript,
        reportFull: result.fullText,
        reportFree: result.freeText,
        viralScore: result.viralScore,
        viralMetrics: result.viralMetrics ?? undefined,
        rewrite: rewrite ?? undefined,
      },
    });

    try {
      await deleteObject(report.mediaKey);
      console.log("Deleted media from R2:", report.mediaKey);
    } catch (err) {
      console.error("Failed to delete media from R2:", err);
    }

    console.log("Job completed:", report.id);
  } catch (err) {
    console.error("processJob error:", err);

    if (isPermanentError(err)) {
      try {
        await prisma.analysisReport.update({
          where: { id: report.id },
          data: { status: "error" },
        });
      } catch (updateErr) {
        console.error("Failed to mark report as error:", updateErr);
      }
    }

    throw err;
  } finally {
    try {
      if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch {}

    try {
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    } catch {}
  }
}
