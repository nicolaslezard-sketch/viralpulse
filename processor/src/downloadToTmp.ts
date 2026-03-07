import fs from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

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
