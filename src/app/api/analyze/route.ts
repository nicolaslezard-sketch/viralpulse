import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import type { PlanKey } from "@/lib/limits";
import { canUseFreeToday, consumeFreeToday } from "@/lib/usage/usage";
import { publishAnalysisJob } from "@/lib/queue/publishAnalysisJob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json().catch(() => null);

    const key = body?.key;
    const mimeType = body?.mimeType;
    const sourceType = body?.sourceType;
    const originalNameFromClient = body?.originalName ?? null;
    const fileSize = body?.fileSize ?? null;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing media key" }, { status: 400 });
    }

    if (!mimeType || typeof mimeType !== "string") {
      return NextResponse.json({ error: "Missing mimeType" }, { status: 400 });
    }

    if (sourceType !== "audio" && sourceType !== "video") {
      return NextResponse.json(
        { error: "Missing sourceType" },
        { status: 400 },
      );
    }

    if (!key.startsWith(`uploads/${userId}/`)) {
      return NextResponse.json({ error: "Invalid media key" }, { status: 403 });
    }

    const plan = (await getUserPlan(userId)) as PlanKey;

    if (plan === "free") {
      const free = await canUseFreeToday(userId);

      if (!free.ok) {
        return NextResponse.json(
          {
            code: "DAILY_LIMIT_REACHED",
            message:
              "You’ve used your free analyses today. Try again tomorrow or upgrade.",
          },
          { status: 429 },
        );
      }
    }

    const report = await prisma.analysisReport.create({
      data: {
        userId,
        sourceType,
        mimeType,
        fileSize: typeof fileSize === "number" ? fileSize : null,
        mediaKey: key,
        originalName: originalNameFromClient?.slice(0, 120) ?? null,
        status: "queued",
      },
      select: { id: true },
    });

    if (plan === "free") {
      await consumeFreeToday(userId);
    }

    await publishAnalysisJob({
      reportId: report.id,
      userId,
      mediaKey: key,
      mimeType,
      sourceType,
    });

    return NextResponse.json({
      id: report.id,
      isPaid: plan !== "free",
      queued: true,
    });
  } catch (err) {
    console.error("❌ analyze error", err);
    return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
  }
}
