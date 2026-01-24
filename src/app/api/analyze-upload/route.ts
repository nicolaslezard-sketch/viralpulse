import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";
import { runAnalysis } from "@/lib/analysis/runAnalysis";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import type { PlanKey } from "@/lib/limits";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let session: Session | null = null;

  try {
    const body = await req.json().catch(() => null);
    const key = body?.key;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    // 🔐 Auth
    session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 🔒 Ownership del archivo
    const expectedPrefix = `uploads/${userId}/`;
    if (!key.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    // ✅ Plan gating mínimo (1 análisis/día para FREE)
    const plan = (await getUserPlan(userId)) as PlanKey;

    if (plan === "free") {
      const start = new Date();
      start.setUTCHours(0, 0, 0, 0);

      const usedToday = await prisma.analysisReport.count({
        where: {
          userId,
          createdAt: { gte: start },
        },
      });

      if (usedToday >= 1) {
        return NextResponse.json(
          { error: "Free plan limit: 1 analysis per day." },
          { status: 429 }
        );
      }
    }

    // 📝 Crear report
    const report = await prisma.analysisReport.create({
      data: {
        userId,
        audioKey: key,
        status: "processing",
        durationSec: 0,
      },
    });

    // 🚀 Disparar análisis (best-effort background en Vercel)
    await runAnalysis({ reportId: report.id }).catch((err) => {
      console.error("runAnalysis background crash:", err);
    });

    return NextResponse.json({ reportId: report.id });
  } catch (err: any) {
    console.error("analyze-upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Analyze failed" },
      { status: 500 }
    );
  }
}
