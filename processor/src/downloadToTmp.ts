import fs from "fs";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

function bytesToMb(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2);
}

export async function downloadToTmp(key: string, tmpPath: string) {
  const timeoutMs = Number(process.env.R2_DOWNLOAD_TIMEOUT_MS ?? 90000);

  const controller = new AbortController();
  const startedAt = Date.now();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let progressTimer: ReturnType<typeof setInterval> | null = null;
  let downloadedBytes = 0;

  try {
    const obj = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      }),
      { abortSignal: controller.signal },
    );

    if (!obj.Body) {
      throw new Error(`R2 object empty for key: ${key}`);
    }

    const totalBytes =
      typeof obj.ContentLength === "number" ? obj.ContentLength : null;

    console.log(
      `[downloadToTmp] Starting download key=${key} size=${
        totalBytes !== null ? `${bytesToMb(totalBytes)} MB` : "unknown"
      } timeoutMs=${timeoutMs}`,
    );

    const body = obj.Body as Readable;
    const writeStream = fs.createWriteStream(tmpPath);

    progressTimer = setInterval(() => {
      const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

      if (totalBytes && totalBytes > 0) {
        const pct = ((downloadedBytes / totalBytes) * 100).toFixed(1);
        console.log(
          `[downloadToTmp] ${key} ${bytesToMb(downloadedBytes)}/${bytesToMb(
            totalBytes,
          )} MB (${pct}%) in ${elapsedSec}s`,
        );
      } else {
        console.log(
          `[downloadToTmp] ${key} downloaded=${bytesToMb(
            downloadedBytes,
          )} MB in ${elapsedSec}s`,
        );
      }
    }, 5000);

    await new Promise<void>((resolve, reject) => {
      let settled = false;

      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      const fail = (err: unknown) => {
        if (settled) return;
        settled = true;
        reject(err);
      };

      body.on("data", (chunk: Buffer) => {
        downloadedBytes += chunk.length;
      });

      body.on("error", (err) => {
        writeStream.destroy();
        fail(err);
      });

      writeStream.on("error", (err) => {
        body.destroy(err);
        fail(err);
      });

      writeStream.on("finish", finish);

      body.pipe(writeStream);
    });

    const totalMs = Date.now() - startedAt;
    console.log(
      `[downloadToTmp] Completed key=${key} saved=${tmpPath} size=${bytesToMb(
        downloadedBytes,
      )} MB in ${totalMs}ms (${(totalMs / 1000).toFixed(2)}s)`,
    );
  } catch (err) {
    const totalMs = Date.now() - startedAt;

    if (controller.signal.aborted) {
      throw new Error(
        `R2 download timeout after ${timeoutMs}ms for key ${key}`,
      );
    }

    console.error(
      `[downloadToTmp] Failed key=${key} after ${totalMs}ms downloaded=${bytesToMb(
        downloadedBytes,
      )} MB`,
      err,
    );

    throw err;
  } finally {
    clearTimeout(timeout);
    if (progressTimer) clearInterval(progressTimer);

    try {
      if (fs.existsSync(tmpPath)) {
        const stat = fs.statSync(tmpPath);
        if (stat.size === 0) {
          fs.unlinkSync(tmpPath);
        }
      }
    } catch {}
  }
}
