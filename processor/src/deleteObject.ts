import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const r2Endpoint = process.env.R2_ENDPOINT;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!r2Endpoint) {
  throw new Error("Missing R2_ENDPOINT");
}

if (!r2AccessKeyId) {
  throw new Error("Missing R2_ACCESS_KEY_ID");
}

if (!r2SecretAccessKey) {
  throw new Error("Missing R2_SECRET_ACCESS_KEY");
}

const r2 = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

export async function deleteObject(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    }),
  );
}
