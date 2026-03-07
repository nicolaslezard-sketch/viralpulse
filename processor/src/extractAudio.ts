import { ffmpeg } from "./ffmpeg";

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
