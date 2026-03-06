import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import fs from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export async function downloadToTmp(key: string, tmpPath: string) {
  const obj = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    }),
  );

  if (!obj.Body) {
    throw new Error("R2 object empty");
  }

  await pipeline(obj.Body as Readable, fs.createWriteStream(tmpPath));
}
