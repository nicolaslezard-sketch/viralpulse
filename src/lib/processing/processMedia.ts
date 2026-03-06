import fs from "fs";
import path from "path";
import os from "os";

import { downloadToTmp } from "@/lib/r2/downloadToTmp";
import { extractAudio } from "@/lib/media/extractAudio";
import { getSourceType } from "@/lib/media/getSourceType";
import { deleteObject } from "@/lib/r2/deleteObject";
import { transcribeFromFile } from "@/lib/analysis/transcribeFromFile";
import { runAnalysis } from "@/lib/analysis/runAnalysis";

export async function processMedia(
  key: string,
  mime: string,
  analysisId: string,
) {
  const type = getSourceType(mime);

  const tmpDir = os.tmpdir();

  const videoPath = path.join(tmpDir, `vp_${analysisId}_video`);
  const audioPath = path.join(tmpDir, `vp_${analysisId}_audio.mp3`);

  const finalAudio = audioPath;

  if (type === "video") {
    await downloadToTmp(key, videoPath);

    await extractAudio(videoPath, audioPath);

    fs.unlinkSync(videoPath);
  } else {
    await downloadToTmp(key, audioPath);
  }

  const transcript = await transcribeFromFile(finalAudio);

  await runAnalysis({ reportId: analysisId });
  fs.unlinkSync(finalAudio);

  await deleteObject(key);

  return {
    transcript,
  };
}
