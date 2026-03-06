import { NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { getUserPlan } from "@/lib/auth/getUserPlan";
import { limitsByPlan, type PlanKey } from "@/lib/limits";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

/**
 * Allowed media MIME types
 * Audio + Video
 */
const ALLOWED_TYPES = new Set([
  // audio
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",

  // video
  "video/mp4",
  "video/quicktime",
  "video/x-m4v",
]);

/**
 * Detect source type
 */
function getSourceType(contentType: string): "audio" | "video" {
  if (contentType.startsWith("video/")) return "video";
  return "audio";
}

/**
 * Map MIME -> extension
 */
function extensionFromContentType(contentType: string): string {
  switch (contentType) {
    case "audio/mpeg":
      return "mp3";

    case "audio/wav":
      return "wav";

    case "audio/mp4":
    case "audio/x-m4a":
      return "m4a";

    case "video/mp4":
      return "mp4";

    case "video/quicktime":
      return "mov";

    case "video/x-m4v":
      return "m4v";

    default:
      return "bin";
  }
}

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    /* =========================
       BODY
    ========================= */
    const body = await req.json().catch(() => null);
    const { filename, contentType, fileSize } = body ?? {};

    if (
      typeof filename !== "string" ||
      typeof contentType !== "string" ||
      typeof fileSize !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 },
      );
    }

    /* =========================
       TYPE GUARD
    ========================= */
    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Unsupported media format" },
        { status: 400 },
      );
    }

    /* =========================
       PLAN LIMITS
    ========================= */
    const plan = (await getUserPlan(userId)) as PlanKey;
    const { maxBytes, ttl } = limitsByPlan[plan];

    if (fileSize > maxBytes) {
      return NextResponse.json(
        {
          error: "File too large for your plan",
          maxBytes,
        },
        { status: 400 },
      );
    }

    /* =========================
       SOURCE TYPE
    ========================= */
    const sourceType = getSourceType(contentType);

    /* =========================
       KEY GENERATION
    ========================= */
    const ext = extensionFromContentType(contentType);

    const key = `uploads/${userId}/${crypto.randomUUID()}.${ext}`;

    /* =========================
       SIGNED URL
    ========================= */
    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, cmd, {
      expiresIn: ttl,
    });

    return NextResponse.json({
      key,
      uploadUrl,
      plan,
      maxBytes,
      sourceType, // 👈 IMPORTANTE
    });
  } catch (err) {
    console.error("UPLOAD-URL ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
