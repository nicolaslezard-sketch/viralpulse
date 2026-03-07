import ffmpeg from "fluent-ffmpeg";

const localFfmpegPath =
  process.env.FFMPEG_PATH ||
  (process.platform === "darwin" ? "/opt/homebrew/bin/ffmpeg" : undefined);

const localFfprobePath =
  process.env.FFPROBE_PATH ||
  (process.platform === "darwin" ? "/opt/homebrew/bin/ffprobe" : undefined);

if (localFfmpegPath) {
  ffmpeg.setFfmpegPath(localFfmpegPath);
}

if (localFfprobePath) {
  ffmpeg.setFfprobePath(localFfprobePath);
}

export { ffmpeg };
