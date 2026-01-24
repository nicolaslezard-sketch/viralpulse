import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/report/generateReport";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { reportId } = await req.json();

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    const report = await prisma.analysisReport.findUnique({
      where: { id: reportId },
    });

    if (!report || !report.transcript) {
      return NextResponse.json({ error: "Invalid report" }, { status: 404 });
    }

    const result = await generateReport(report.transcript);

    await prisma.analysisReport.update({
      where: { id: reportId },
      data: {
        status: "done",
        reportFull: result.full,
        reportFree: result.free,
        transcript: result.transcript,
        durationSec: result.durationSec,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("analyze-report failed", err);

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
