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
    select: { id: true, userId: true, audioKey: true, status: true },
  });

  if (!report) {
    console.log("❌ report not found");
    return;
  }

  // idempotencia
  if (report.status !== "processing") {
    console.log("⏭ report not in processing state");
    return;
  }

  const plan = (await getUserPlan(report.userId)) as PlanKey;
  const limits = limitsByPlan[plan];

  try {
    // 1️⃣ transcribir
    const { transcript, durationSec } = await transcribeFromR2(report.audioKey);
    console.log("✅ transcription done", durationSec);

    // 2️⃣ límite por plan
    if (durationSec > limits.maxSeconds) {
      await prisma.analysisReport.update({
        where: { id: reportId },
        data: {
          status: "error",
          durationSec,
        },
      });
      console.log("⛔ duration limit exceeded");
      return;
    }

    // 3️⃣ generar reporte IA
    const result = await generateReport(transcript);
    console.log("✅ report generated");

    const rewrite = await generateRewrite(transcript);
    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "done",
        reportFull: result.fullText,
        reportFree: result.freeText,

        transcript,
        durationSec,

        rewrite: rewrite ?? undefined,
      },
    });

    // 4️⃣ guardar resultado
    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "done",
        reportFull: result.fullText,
        reportFree: result.freeText,

        transcript,
        durationSec,
      },
    });

    console.log("🎉 report saved");
  } catch (err) {
    console.error("🔥 runAnalysis failed", err);

    await prisma.analysisReport.update({
      where: { id: reportId },
      data: { status: "error" },
    });
  }
}
