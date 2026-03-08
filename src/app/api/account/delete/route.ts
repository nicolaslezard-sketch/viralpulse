import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = null;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const confirmation =
    body &&
    typeof body === "object" &&
    "confirmation" in body &&
    typeof (body as { confirmation?: unknown }).confirmation === "string"
      ? (body as { confirmation: string }).confirmation
      : "";

  if (confirmation.trim() !== "DELETE") {
    return NextResponse.json(
      { error: "Type DELETE to confirm account deletion." },
      { status: 400 },
    );
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction([
      prisma.analysisReport.deleteMany({
        where: { userId },
      }),
      prisma.dailyUsage.deleteMany({
        where: { userId },
      }),
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
