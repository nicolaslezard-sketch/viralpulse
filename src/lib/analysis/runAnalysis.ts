import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/report/generateReport";
import { transcribeFromR2 } from "@/lib/analysis/transcribeFromR2";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import type { PlanKey } from "@/lib/limits";
import { limitsByPlan } from "@/lib/limits";
import { generateRewrite } from "@/lib/report/generateRewrite";

export async function runAnalysis({ reportId }: { reportId: string }) {
  console.log("▶️ runAnalysis start", reportId);

  // 0) cargar report
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
    },
  });

  if (!report) {
    console.log("❌ report not found");
    return;
  }

  // idempotencia
  if (report.status !== "processing") {
    console.log("⏭️ report not in processing state");
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
    // 1) transcribir
    const { transcript, durationSec } = await transcribeFromR2(
      report.mediaKey,
      report.mimeType,
    );

    console.log("✅ transcription done", durationSec);

    // 2) límite por plan
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

    // 3) generar report
    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "analyzing",
        durationSec,
        transcript,
      },
    });

    const result = await generateReport(transcript);

    // 4) rewrite
    const rewrite = await generateRewrite({
      transcript,
      report: result.fullText,
    });
    // 5) guardar final
    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "done",
        durationSec,
        transcript,
        reportFull: result.fullText,
        reportFree: result.freeText,
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
