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
import { generateReport } from "./lib/report/generateReport";
import { generateRewrite } from "./lib/report/generateRewrite";
import { buildReportForUser } from "./lib/report/buildReportForUser";
import { getUserPlan } from "./lib/auth/getUserPlan";
import { consumeMonthlyMinutes } from "./lib/usage/usage";

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

function bytesToMb(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2);
}

function fileSizeMb(filePath: string) {
  try {
    const stat = fs.statSync(filePath);
    return `${bytesToMb(stat.size)} MB`;
  } catch {
    return "unknown";
  }
}

function nowMs() {
  return Date.now();
}

function elapsedMs(startMs: number) {
  return Date.now() - startMs;
}

function logStep(reportId: string, label: string, startMs: number) {
  const ms = elapsedMs(startMs);
  console.log(
    `[${reportId}] ${label} took ${ms}ms (${(ms / 1000).toFixed(2)}s)`,
  );
}

export async function processJob(rawJob: unknown) {
  const job = normalizeJob(rawJob);

  console.log("Processing job:", job.reportId, job.mediaKey, job.mimeType);

  const jobStartedAt = nowMs();

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

  function getExtensionFromMimeType(mimeType: string) {
    switch (mimeType) {
      case "audio/mpeg":
        return ".mp3";
      case "audio/mp4":
      case "audio/x-m4a":
      case "audio/m4a":
        return ".m4a";
      case "audio/wav":
      case "audio/x-wav":
        return ".wav";
      case "audio/webm":
        return ".webm";
      case "video/mp4":
        return ".mp4";
      case "video/quicktime":
        return ".mov";
      case "video/x-m4v":
      case "video/m4v":
        return ".m4v";
      default:
        return "";
    }
  }

  const inputExt = getExtensionFromMimeType(report.mimeType);
  const mediaPath = path.join(tmpDir, `${baseName}_input${inputExt}`);
  const audioPath = path.join(tmpDir, `${baseName}_audio.mp3`);

  try {
    const updateExtractingStart = nowMs();
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: { status: "extracting_audio" },
    });
    logStep(report.id, "db:update extracting_audio", updateExtractingStart);

    const downloadStart = nowMs();
    await downloadToTmp(report.mediaKey, mediaPath);
    logStep(report.id, "downloadToTmp", downloadStart);
    console.log(
      `[${report.id}] Downloaded media: ${mediaPath} (${fileSizeMb(mediaPath)})`,
    );

    let finalAudioPath = mediaPath;

    if (isVideoMime(report.mimeType)) {
      const extractStart = nowMs();
      await extractAudio(mediaPath, audioPath);
      logStep(report.id, "extractAudio", extractStart);
      console.log(
        `[${report.id}] Audio extracted: ${audioPath} (${fileSizeMb(audioPath)})`,
      );

      finalAudioPath = audioPath;

      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    } else {
      console.log(
        `[${report.id}] Source is audio, skipping extraction (${fileSizeMb(finalAudioPath)})`,
      );
    }

    const durationStart = nowMs();
    const durationSec = await getMediaDurationSeconds(finalAudioPath);
    logStep(report.id, "getMediaDurationSeconds", durationStart);
    console.log(`[${report.id}] Duration detected: ${durationSec}s`);

    const updateTranscribingStart = nowMs();
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "transcribing",
        durationSec,
      },
    });
    logStep(report.id, "db:update transcribing", updateTranscribingStart);

    const transcriptStart = nowMs();
    let transcript: string;

    try {
      transcript = await transcribeFromFile(finalAudioPath);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.toLowerCase().includes("unsupported file format")
      ) {
        throw new PermanentJobError(
          `Unsupported audio format for transcription: ${finalAudioPath}`,
        );
      }
      throw err;
    }

    logStep(report.id, "transcribeFromFile", transcriptStart);
    console.log(`[${report.id}] Transcript ready, chars: ${transcript.length}`);

    const minSeconds = Number(process.env.MIN_AUDIO_SECONDS ?? 8);
    const minTranscriptChars = Number(process.env.MIN_TRANSCRIPT_CHARS ?? 80);

    if (
      durationSec < minSeconds ||
      transcript.trim().length < minTranscriptChars
    ) {
      const updateErrorStart = nowMs();
      await prisma.analysisReport.update({
        where: { id: report.id },
        data: {
          status: "error",
          durationSec,
          transcript,
        },
      });
      logStep(report.id, "db:update error (too short)", updateErrorStart);

      throw new PermanentJobError(
        `Content too short or transcript too small for report ${report.id}`,
      );
    }

    const updateAnalyzingStart = nowMs();
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "analyzing",
        durationSec,
        transcript,
      },
    });
    logStep(report.id, "db:update analyzing", updateAnalyzingStart);

    const reportStart = nowMs();
    const result = await generateReport(transcript);
    logStep(report.id, "generateReport", reportStart);
    console.log(`[${report.id}] Report generated`);

    const rewriteStart = nowMs();
    const rewrite = await generateRewrite({
      transcript,
      report: result.fullText,
    });
    logStep(report.id, "generateRewrite", rewriteStart);
    console.log(`[${report.id}] Rewrite generated`);

    const reportFull = {
      ...result.fullText,
      rewrite: rewrite ?? undefined,
    };

    const reportFree = buildReportForUser(reportFull, "free");

    const updateDoneStart = nowMs();
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "done",
        durationSec,
        transcript,
        reportFull,
        reportFree,
        viralScore: result.viralScore,
        viralMetrics: result.viralMetrics ?? undefined,
        rewrite: rewrite ?? undefined,
      },
    });
    logStep(report.id, "db:update done", updateDoneStart);

    const userPlan = await getUserPlan(report.userId);

    if (userPlan !== "free") {
      const minutesToConsume = Math.max(1, Math.ceil(durationSec / 60));

      const usageStart = nowMs();
      await consumeMonthlyMinutes({
        userId: report.userId,
        minutesToConsume,
      });
      logStep(report.id, "usage:consumeMonthlyMinutes", usageStart);
    }

    try {
      const deleteStart = nowMs();
      await deleteObject(report.mediaKey);
      logStep(report.id, "deleteObject", deleteStart);
      console.log("Deleted media from R2:", report.mediaKey);
    } catch (err) {
      console.error("Failed to delete media from R2:", err);
    }

    const totalMs = elapsedMs(jobStartedAt);
    console.log(
      `[${report.id}] Job completed in ${totalMs}ms (${(totalMs / 1000).toFixed(2)}s)`,
    );
  } catch (err) {
    console.error("processJob error:", err);

    if (isPermanentError(err)) {
      try {
        const updateErrorStart = nowMs();
        await prisma.analysisReport.update({
          where: { id: report.id },
          data: { status: "error" },
        });
        logStep(report.id, "db:update error", updateErrorStart);
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
