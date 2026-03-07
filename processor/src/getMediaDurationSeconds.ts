import { ffmpeg } from "./ffmpeg";

export function getMediaDurationSeconds(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) return reject(err);
      resolve(Math.round(data.format.duration ?? 0));
    });
  });
}
