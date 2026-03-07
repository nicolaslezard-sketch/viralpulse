import "dotenv/config";
import fs from "fs";
import os from "os";
import path from "path";

import { prisma } from "../../src/lib/prisma";
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

function isVideoMime(mimeType: string) {
  return mimeType.startsWith("video/");
}

export async function processJob(job: AnalysisJob) {
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
    throw new Error(`Report not found: ${job.reportId}`);
  }

  if (report.status === "done") {
    console.log("Report already done:", report.id);
    return;
  }

  if (!report.mediaKey || !report.mimeType) {
    throw new Error(`Missing mediaKey or mimeType for report ${report.id}`);
  }

  const tmpDir = os.tmpdir();
  const baseName = `vp_${report.id}_${Date.now()}`;

  const mediaPath = path.join(tmpDir, `${baseName}_input`);
  const audioPath = path.join(tmpDir, `${baseName}_audio.mp3`);

  let finalAudioPath = mediaPath;

  try {
    /* =========================
       1) DOWNLOAD ORIGINAL MEDIA
    ========================= */
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: { status: "extracting_audio" },
    });

    await downloadToTmp(report.mediaKey, mediaPath);

    /* =========================
       2) VIDEO -> AUDIO
    ========================= */
    if (isVideoMime(report.mimeType)) {
      await extractAudio(mediaPath, audioPath);
      finalAudioPath = audioPath;

      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    }

    /* =========================
       3) DURATION
    ========================= */
    const durationSec = await getMediaDurationSeconds(finalAudioPath);

    /* =========================
       4) TRANSCRIBE
    ========================= */
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "transcribing",
        durationSec,
      },
    });

    const transcript = await transcribeFromFile(finalAudioPath);

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

      throw new Error(
        `Content too short or transcript too small for report ${report.id}`,
      );
    }

    /* =========================
       5) GENERATE REPORT
    ========================= */
    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "analyzing",
        durationSec,
        transcript,
      },
    });

    const result = await generateReport(transcript);

    /* =========================
       6) GENERATE REWRITE
    ========================= */
    const rewrite = await generateRewrite({
      transcript,
      report: result.fullText,
    });

    /* =========================
       7) SAVE FINAL
    ========================= */
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

    /* =========================
       8) CLEANUP R2
    ========================= */
    try {
      await deleteObject(report.mediaKey);
      console.log("Deleted media from R2:", report.mediaKey);
    } catch (err) {
      console.error("Failed to delete media from R2:", err);
    }

    console.log("Job completed:", report.id);
  } catch (err) {
    console.error("processJob error:", err);

    await prisma.analysisReport.update({
      where: { id: report.id },
      data: {
        status: "error",
      },
    });

    throw err;
  } finally {
    if (fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath);
    }

    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  }
}
