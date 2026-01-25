import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { runAnalysis } from "@/lib/analysis/runAnalysis";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import type { PlanKey } from "@/lib/limits";

export const runtime = "nodejs";

const TEST_EMAILS = ["nicolaslezard@gmail.com"];

export async function POST(req: Request) {
  try {
    /* =========================
       BODY
    ========================= */
    const body = await req.json().catch(() => null);
    const key = body?.key;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    /* =========================
       OWNERSHIP
    ========================= */
    const expectedPrefix = `uploads/${userId}/`;
    if (!key.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    /* =========================
       PLAN GATING (FREE)
    ========================= */
    const plan = (await getUserPlan(userId)) as PlanKey;
    const isTester = TEST_EMAILS.includes(session.user.email ?? "");

    if (plan === "free" && !isTester) {
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

    /* =========================
       CREATE REPORT
    ========================= */
    const report = await prisma.analysisReport.create({
      data: {
        userId,
        audioKey: key,
        status: "processing",
        durationSec: 0,
      },
    });

    /* =========================
       BACKGROUND ANALYSIS
       (fire & forget)
    ========================= */
    runAnalysis({ reportId: report.id }).catch((err) => {
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
