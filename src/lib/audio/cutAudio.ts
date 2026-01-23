import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function cutAudio(
  inputPath: string,
  outputPath: string,
  maxSeconds: number
) {
  const cmd = `ffmpeg -y -i "${inputPath}" -t ${maxSeconds} "${outputPath}"`;
  await execAsync(cmd);
}
