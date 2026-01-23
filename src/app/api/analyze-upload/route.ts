import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";

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

    // 📝 Crear report en estado processing
   const report = await prisma.analysisReport.create({
  data: {
    userId,
    audioKey: key,
    status: "processing",
    durationSec: 0, // placeholder, se actualiza en Inngest
  },
});


    // 🚀 Disparar análisis en background (Inngest)
    await inngest.send({
      name: "report/analyze",
      data: {
        reportId: report.id,
      },
    });

    // Respuesta inmediata
    return NextResponse.json({ reportId: report.id });
  } catch (err: any) {
    console.error("analyze-upload error:", err);

    return NextResponse.json(
      { error: err?.message || "Analyze failed" },
      { status: 500 }
    );
  }
}
