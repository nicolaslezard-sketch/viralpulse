import { NextResponse } from "next/server";
import { processMedia } from "@/lib/processing/processMedia";

export async function POST(req: Request) {
  const body = await req.json();

  const { key, mime, analysisId } = body;

  setImmediate(async () => {
    try {
      await processMedia(key, mime, analysisId);
    } catch (err) {
      console.error("PROCESS ERROR", err);
    }
  });

  return NextResponse.json({ status: "processing" });
}
