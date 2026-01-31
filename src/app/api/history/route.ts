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

  // 🔒 FREE no tiene historial
  if (plan === "free") {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const reports = await prisma.analysisReport.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      durationSec: true,
    },
  });

  return NextResponse.json({ reports });
}
