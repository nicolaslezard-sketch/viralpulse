import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const reportId = params.id;

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
      reportFree: true,
      transcript: true,
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

  const isPro = viewer?.plan === "pro";

  let parsedReport: string | null = null;

  try {
    const raw = isPro ? report.reportFull : report.reportFree;
    parsedReport = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to parse report JSON", e);
  }

  return NextResponse.json({
    id: report.id,
    status: report.status,
    duration: report.durationSec,
    wasTrimmed: report.wasTrimmed,
    createdAt: report.createdAt,
    report: parsedReport,
    transcript: isPro ? report.transcript : null,
    isPro,
  });
}
