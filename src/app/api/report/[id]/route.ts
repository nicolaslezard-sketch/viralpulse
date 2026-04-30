import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { FullReport } from "@/lib/report/types";
import { normalizeReport } from "@/lib/report/normalizeReport";

export const runtime = "nodejs";

function buildTranscriptPreview(transcript: string | null) {
  const raw = (transcript || "").trim();
  if (!raw) return null;

  const target = 650;

  if (raw.length <= target) return raw;

  const sliced = raw.slice(0, target);
  const lastBreak = Math.max(
    sliced.lastIndexOf(". "),
    sliced.lastIndexOf("\n"),
    sliced.lastIndexOf(" "),
  );

  const safe =
    lastBreak > 320 ? sliced.slice(0, lastBreak).trim() : sliced.trim();

  return `${safe}…`;
}

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
      reportFree: true,
      freeFullPreview: true,
      oneShotUnlocked: true,
      viralScore: true,
      viralMetrics: true,
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

  const isPaid = viewer?.plan !== "free";

  let freeFullPreview = report.freeFullPreview;

  /*
    Safety fallback:
    The processor should mark the first completed free report as freeFullPreview.
    If it didn't, the report API grants it when the user opens their first done report.
  */
  if (
    !isPaid &&
    report.status === "done" &&
    report.reportFull &&
    !report.freeFullPreview &&
    !report.oneShotUnlocked
  ) {
    const existingFreeFullPreview = await prisma.analysisReport.findFirst({
      where: {
        userId,
        status: "done",
        freeFullPreview: true,
      },
      select: { id: true },
    });

    if (!existingFreeFullPreview) {
      await prisma.analysisReport.update({
        where: { id: report.id },
        data: { freeFullPreview: true },
      });

      freeFullPreview = true;
    }
  }

  const canSeeFull = isPaid || freeFullPreview || report.oneShotUnlocked;

  const rawReport = canSeeFull ? report.reportFull : report.reportFree;

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
        rewrite: normalized.rewrite ?? persistedRewrite,
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
    viralMetrics: canSeeFull ? (report.viralMetrics ?? null) : null,
    transcript: canSeeFull ? (report.transcript ?? null) : null,
    transcriptPreview: canSeeFull
      ? (report.transcript ?? null)
      : buildTranscriptPreview(report.transcript ?? null),
    isPaid,
    canSeeFull,
    freeFullPreview,
    oneShotUnlocked: report.oneShotUnlocked,
  });
}
