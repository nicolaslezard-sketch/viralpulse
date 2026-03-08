import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/report/generateReport";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import type { PlanKey } from "@/lib/limits";
import { limitsByPlan } from "@/lib/limits";
import { generateRewrite } from "@/lib/report/generateRewrite";
import { buildReportForUser } from "@/lib/report/buildReportForUser";

export async function runAnalysis({ reportId }: { reportId: string }) {
  console.log("▶️ runAnalysis start", reportId);

  const report = await prisma.analysisReport.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      userId: true,
      status: true,
      mediaKey: true,
      mimeType: true,
      sourceType: true,
      originalName: true,
      transcript: true,
      durationSec: true,
    },
  });

  if (!report) {
    console.log("❌ report not found");
    return;
  }

  if (
    report.status !== "processing" &&
    report.status !== "queued" &&
    report.status !== "analyzing"
  ) {
    console.log("⏭️ report not in runnable state");
    return;
  }

  if (!report.mediaKey) {
    console.log("❌ mediaKey missing");
    await prisma.analysisReport.update({
      where: { id: reportId },
      data: { status: "error" },
    });
    return;
  }

  if (!report.mimeType) {
    console.log("❌ mimeType missing");
    await prisma.analysisReport.update({
      where: { id: reportId },
      data: { status: "error" },
    });
    return;
  }

  const plan = (await getUserPlan(report.userId)) as PlanKey;
  const limits = limitsByPlan[plan];

  try {
    const transcript = report.transcript ?? "";
    const durationSec = report.durationSec ?? 0;

    if (!transcript || !durationSec) {
      throw new Error(
        `runAnalysis requires transcript and duration precomputed for report ${report.id}`,
      );
    }

    console.log("✅ using precomputed transcript", durationSec);

    if (durationSec > limits.maxSeconds) {
      console.log("❌ media too long for plan");

      await prisma.analysisReport.update({
        where: { id: reportId },
        data: {
          status: "error",
          durationSec,
          transcript,
        },
      });

      return;
    }

    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "analyzing",
        durationSec,
        transcript,
      },
    });

    const result = await generateReport(transcript);

    const rewrite = await generateRewrite({
      transcript,
      report: result.fullText,
    });

    const reportFull = {
      ...result.fullText,
      rewrite: rewrite ?? undefined,
    };

    const reportFree = buildReportForUser(reportFull, "free");

    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "done",
        durationSec,
        transcript,
        reportFull,
        reportFree,
        rewrite: rewrite ?? undefined,
        viralScore: result.viralScore,
        viralMetrics: result.viralMetrics ?? undefined,
      },
    });

    console.log("✅ runAnalysis finished", reportId);
  } catch (error) {
    console.error("❌ runAnalysis error", error);

    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "error",
      },
    });
  }
}
