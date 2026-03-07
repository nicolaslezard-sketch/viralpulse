import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserPlan } from "@/lib/auth/getUserPlan";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const plan = await getUserPlan(userId);

  const rawReports = await prisma.analysisReport.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      status: true,
      createdAt: true,
      durationSec: true,
      viralScore: true,
      reportFull: true,
      reportFree: true,
      originalName: true,
    },
  });

  const reports = rawReports.map((r) => {
    if (plan === "free") {
      return {
        id: r.id,
        status: r.status,
        createdAt: r.createdAt,
        durationSec: r.durationSec,
        viralScore: r.viralScore,
        originalName: r.originalName,
        reportFree: r.reportFree ?? null,
        reportFull: null,
      };
    }

    return {
      ...r,
      reportFull: r.reportFull ?? null,
      reportFree: r.reportFree ?? null,
    };
  });

  return NextResponse.json({ reports });
}
