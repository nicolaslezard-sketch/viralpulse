import ffmpeg from "fluent-ffmpeg";

export function removeSilence(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .audioFilters("silenceremove=1:0:-50dB")
      .save(output)
      .on("end", () => resolve())
      .on("error", reject);
  });
}
