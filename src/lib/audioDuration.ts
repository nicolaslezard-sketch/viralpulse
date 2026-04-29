type BrowserAudioContextConstructor = {
  new (): AudioContext;
};

type WindowWithWebkitAudioContext = Window & {
  webkitAudioContext?: BrowserAudioContextConstructor;
};

export async function getAudioDurationSeconds(
  file: File
): Promise<number | null> {
  try {
    const win = window as WindowWithWebkitAudioContext;
    const AudioCtx = window.AudioContext || win.webkitAudioContext;

    if (!AudioCtx) return null;

    // Avoid decoding very large files on the client (can be slow / memory heavy)
    const MAX_DECODE_MB = 25;
    if (file.size > MAX_DECODE_MB * 1024 * 1024) return null;

    const buf = await file.arrayBuffer();
    const ctx = new AudioCtx();
    const audioBuffer = await ctx.decodeAudioData(buf.slice(0));
    await ctx.close();

    return typeof audioBuffer.duration === "number" ? audioBuffer.duration : null;
  } catch {
    return null;
  }
}
