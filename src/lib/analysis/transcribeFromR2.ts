import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getOpenAIClient } from "@/lib/openai";
import fs from "fs";
import os from "os";
import path from "path";
import { pipeline } from "stream/promises";

export async function transcribeFromR2(audioKey: string): Promise<{
  transcript: string;
  durationSec: number;
}> {
  // 1) Descargar de R2 a /tmp
  const obj = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: audioKey,
    })
  );

  if (!obj.Body) throw new Error("R2 object has no body");

  const tmpPath = path.join(os.tmpdir(), `vp-${Date.now()}-${Math.random()}.bin`);
  await pipeline(obj.Body as any, fs.createWriteStream(tmpPath));

  try {
    // 2) Transcribir con OpenAI
    // Usamos whisper-1 verbose_json + timestamps => podemos calcular durationSec
    // (Y además es simple y muy estable)
    const openai = getOpenAIClient();

    const resp: any = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const transcript: string = resp?.text ?? "";
    const segments: Array<{ end?: number }> = resp?.segments ?? [];
    const durationSec =
      segments.length > 0
        ? Math.ceil(segments[segments.length - 1]?.end ?? 0)
        : 0;

    return { transcript, durationSec };
  } finally {
    // 3) Cleanup
    try {
      fs.unlinkSync(tmpPath);
    } catch {}
  }
}
