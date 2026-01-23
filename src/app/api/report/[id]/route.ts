import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ⬇️ Next 15: params es Promise
  const { id: reportId } = await params;

  if (!reportId) {
    return NextResponse.json(
      { error: "Missing report id" },
      { status: 400 }
    );
  }

  const report = await prisma.analysisReport.findUnique({
    where: { id: reportId },
    include: {
      user: {
        select: {
          plan: true,
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json(
      { error: "Report not found" },
      { status: 404 }
    );
  }

  const isPro = report.user.plan === "pro";

  return NextResponse.json({
    id: report.id,
    status: report.status,
    duration: report.durationSec,
    wasTrimmed: report.wasTrimmed,
    createdAt: report.createdAt,

    // 🔑 BACKEND decide qué contenido ve el usuario
    report: isPro ? report.reportFull : report.reportFree,
    transcript: isPro ? report.transcript : null,

    isPro,
  });
}
