import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getAudioDurationSeconds(
  filePath: string
): Promise<number> {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${filePath}"`
  );

  return Math.ceil(Number(stdout.trim()));
}
