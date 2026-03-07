import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "ffprobe-static";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

if (ffprobe.path) {
  ffmpeg.setFfprobePath(ffprobe.path);
}

export function extractAudio(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate("64k")
      .audioChannels(1)
      .audioFrequency(16000)
      .save(output)
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
}
