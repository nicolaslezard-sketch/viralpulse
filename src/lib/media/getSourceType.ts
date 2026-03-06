export type SourceType = "audio" | "video";

export function getSourceType(mime: string): SourceType {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  throw new Error("Unsupported media type");
}
