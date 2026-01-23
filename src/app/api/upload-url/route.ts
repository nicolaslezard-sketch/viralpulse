import { NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { limitsByPlan, type PlanKey } from "@/lib/limits";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "audio/mpeg",   // mp3
  "audio/wav",
  "audio/mp4",    // m4a (chrome)
  "audio/x-m4a",  // m4a (safari / iOS)  👈 FIX
  "audio/ogg",
  "audio/webm",
]);


export async function POST(req: Request) {
  try {
    const { filename, contentType, fileSize } = await req.json();

    if (
      typeof filename !== "string" ||
      typeof contentType !== "string" ||
      typeof fileSize !== "number"
    ) {
      return NextResponse.json({ error: "Missing/invalid fields" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

   const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const userId = session.user.id;


    const plan = (await getUserPlan(userId)) as PlanKey; // ideal: que getUserPlan devuelva PlanKey
    const { maxBytes, ttl } = limitsByPlan[plan];

    if (fileSize > maxBytes) {
      return NextResponse.json({ error: "File too large for plan" }, { status: 400 });
    }

    // Mejor que confiar en filename: usar una extensión coherente con contentType
    const extFromType =
      contentType === "audio/mpeg" ? "mp3" :
      contentType === "audio/wav" ? "wav" :
      contentType === "audio/mp4" ? "m4a" :
      contentType === "audio/ogg" ? "ogg" :
      contentType === "audio/webm" ? "webm" : "bin";

    const key = `uploads/${userId}/${crypto.randomUUID()}.${extFromType}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: ttl });

    return NextResponse.json({ key, uploadUrl, plan, maxBytes });
  } catch (e: any) {
    console.error("UPLOAD-URL ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
