import { execFile } from "child_process";
import { promisify } from "util";

const exec = promisify(execFile);

export async function normalizeAudio(
  inputPath: string,
  outputPath: string
) {
  await exec("ffmpeg", [
    "-y",
    "-i", inputPath,
    "-ac", "1",
    "-ar", "16000",
    "-b:a", "64k",
    outputPath,
  ]);
}
