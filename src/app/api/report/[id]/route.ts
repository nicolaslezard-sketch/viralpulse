import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { FullReport } from "@/lib/report/types";
import { normalizeReport } from "@/lib/report/normalizeReport";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: reportId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const report = await prisma.analysisReport.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      userId: true,
      status: true,
      durationSec: true,
      wasTrimmed: true,
      createdAt: true,
      reportFull: true,
      viralScore: true,
      viralMetrics: true,
      reportFree: true,
      transcript: true,
      rewrite: true,
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const viewer = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const isPro = viewer?.plan !== "free";
  const rawReport = isPro ? report.reportFull : report.reportFree;

  let reportJson: FullReport | null = null;

  if (rawReport) {
    const normalized = normalizeReport(rawReport);

    if (normalized) {
      const persistedRewrite =
        report.rewrite &&
        typeof report.rewrite === "object" &&
        !Array.isArray(report.rewrite)
          ? (report.rewrite as FullReport["rewrite"])
          : undefined;

      reportJson = {
        ...normalized,
        rewrite: isPro ? (persistedRewrite ?? normalized.rewrite) : undefined,
      };
    }
  }

  return NextResponse.json({
    id: report.id,
    status: report.status,
    duration: report.durationSec,
    wasTrimmed: report.wasTrimmed,
    createdAt: report.createdAt,
    report: reportJson,
    viralScore: report.viralScore ?? null,
    viralMetrics: report.viralMetrics ?? null,
    transcript: isPro ? report.transcript : null,
    isPro,
  });
}
