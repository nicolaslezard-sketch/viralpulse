import ffmpeg from "fluent-ffmpeg";

export function extractAudio(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate("32k")
      .audioChannels(1)
      .audioFrequency(16000)
      .outputOptions(["-map_metadata", "-1", "-vn", "-sn", "-dn"])
      .save(output)
      .on("end", () => resolve())
      .on("error", reject);
  });
}
