import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const plan = await getUserPlan(userId);

  if (plan !== "pro") {
    return NextResponse.json(
      { error: "PRO_ONLY" },
      { status: 403 }
    );
  }

  const reports = await prisma.analysisReport.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      durationSec: true,
      wasTrimmed: true,
      createdAt: true,
    },
  });

  return NextResponse.json(reports);
}

