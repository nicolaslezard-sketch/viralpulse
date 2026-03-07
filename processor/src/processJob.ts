import "dotenv/config";

import { prisma } from "../../src/lib/prisma";
import { deleteObject } from "./deleteObject";
import { generateReport } from "../../src/lib/report/generateReport";
import { generateRewrite } from "../../src/lib/report/generateRewrite";

export type AnalysisJob = {
  reportId: string;
  userId: string;
  mediaKey: string;
  mimeType: string;
  sourceType: "audio" | "video";
};

export async function processJob(job: AnalysisJob) {
  console.log("Processing job:", job.reportId, job.mediaKey, job.mimeType);

  const report = await prisma.analysisReport.findUnique({
    where: { id: job.reportId },
    select: {
      id: true,
      status: true,
      transcript: true,
      durationSec: true,
      mediaKey: true,
      mimeType: true,
      sourceType: true,
    },
  });

  if (!report) {
    throw new Error(`Report not found: ${job.reportId}`);
  }

  if (report.status === "done") {
    console.log("Report already done:", report.id);
    return;
  }

  if (!report.transcript || !report.durationSec) {
    throw new Error(
      `Missing preflight transcript/duration for report ${report.id}`,
    );
  }

  await prisma.analysisReport.update({
    where: { id: report.id },
    data: {
      status: "analyzing",
    },
  });

  const result = await generateReport(report.transcript);

  const rewrite = await generateRewrite({
    transcript: report.transcript,
    report: result.fullText,
  });

  await prisma.analysisReport.update({
    where: { id: report.id },
    data: {
      status: "done",
      reportFull: result.fullText,
      reportFree: result.freeText,
      viralScore: result.viralScore,
      viralMetrics: result.viralMetrics ?? undefined,
      rewrite: rewrite ?? undefined,
    },
  });

  // cleanup: borrar video/audio original de R2
  if (report.mediaKey) {
    try {
      await deleteObject(report.mediaKey);
      console.log("Deleted media from R2:", report.mediaKey);
    } catch (err) {
      console.error("Failed to delete media from R2:", err);
    }
  }

  console.log("Job completed:", report.id);
}
