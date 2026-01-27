import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

/**
 * Get audio duration in seconds using ffprobe
 * No OpenAI usage
 */
export async function getAudioDurationSecondsFromR2(
  localPath: string
): Promise<number> {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=nw=1:nk=1",
    localPath,
  ]);

  const seconds = Math.ceil(Number(stdout.trim()));

  if (!seconds || Number.isNaN(seconds)) {
    throw new Error("Unable to detect audio duration");
  }

  return seconds;
}
