import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/report/generateReport";
import { transcribeFromR2 } from "@/lib/analysis/transcribeFromR2";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import type { PlanKey } from "@/lib/limits";
import { limitsByPlan } from "@/lib/limits";

export async function runAnalysis({ reportId }: { reportId: string }) {
  // 0) Cargar report + user
  const report = await prisma.analysisReport.findUnique({
    where: { id: reportId },
    select: { id: true, userId: true, audioKey: true, status: true },
  });

  if (!report) return;

  // idempotencia básica
  if (report.status !== "processing") return;

  const plan = (await getUserPlan(report.userId)) as PlanKey;
  const limits = limitsByPlan[plan];

  try {
    // 1) Transcribir desde R2 (con timestamps para calcular duración)
    const { transcript, durationSec } = await transcribeFromR2(report.audioKey);

    // 2) Enforce duración por plan
    if (durationSec > limits.maxSeconds) {
      // Por ahora: bloqueamos (simple). Si querés “trim” real después lo hacemos.
      await prisma.analysisReport.update({
        where: { id: reportId },
        data: {
          status: "error",
          durationSec,
        },
      });
      return;
    }

    // 3) Generar reporte con OpenAI
    const result = await generateReport(transcript);

    // 4) Guardar en DB
   await prisma.analysisReport.update({
  where: { id: reportId },
  data: {
    status: "done",
    reportFull: JSON.stringify(result.fullText),
    reportFree: JSON.stringify(result.freeText),
    transcript,
    durationSec,
  },
});



  } catch (err: unknown) {
    console.error("runAnalysis failed", err);

    await prisma.analysisReport.update({
      where: { id: reportId },
      data: { status: "error" },
    });
  }
}
