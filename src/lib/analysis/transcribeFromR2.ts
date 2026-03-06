import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "stream/promises";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";

import { r2 } from "@/lib/r2";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function isVideo(mime: string) {
  return mime.startsWith("video/");
}

function extractAudio(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate("64k")
      .audioChannels(1)
      .audioFrequency(16000)
      .save(output)
      .on("end", () => resolve())
      .on("error", reject);
  });
}

export async function transcribeFromR2(
  key: string,
  mimeType: string,
): Promise<{ transcript: string; durationSec: number }> {
  const tmpDir = os.tmpdir();

  const mediaPath = path.join(tmpDir, `vp_media_${Date.now()}`);
  const audioPath = path.join(tmpDir, `vp_audio_${Date.now()}.mp3`);

  let durationSec = 0;

  try {
    /* =====================
       DOWNLOAD
    ===================== */

    const obj = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      }),
    );

    if (!obj.Body) throw new Error("R2 object empty");

    await pipeline(obj.Body as any, fs.createWriteStream(mediaPath));

    let finalAudio = mediaPath;

    /* =====================
       VIDEO → AUDIO
    ===================== */

    if (isVideo(mimeType)) {
      await extractAudio(mediaPath, audioPath);

      fs.unlinkSync(mediaPath);

      finalAudio = audioPath;
    }

    /* =====================
       ESTIMATE DURATION
    ===================== */

    await new Promise<void>((resolve, reject) => {
      ffmpeg.ffprobe(finalAudio, (err, data) => {
        if (err) return reject(err);

        durationSec = Math.round(data.format.duration ?? 0);
        resolve();
      });
    });

    /* =====================
       TRANSCRIPTION
    ===================== */

    const resp = await openai.audio.transcriptions.create({
      file: fs.createReadStream(finalAudio),
      model: "gpt-4o-mini-transcribe",
    });

    fs.unlinkSync(finalAudio);

    return {
      transcript: resp.text,
      durationSec,
    };
  } catch (err) {
    console.error("TRANSCRIBE ERROR:", err);

    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    throw err;
  }
}
