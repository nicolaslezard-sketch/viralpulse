export function copyPlain(text: string) {
  navigator.clipboard.writeText(text);
}

export function copyList(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-\d.]+\s*/, "").trim())
    .filter(Boolean);

  navigator.clipboard.writeText(lines.join("\n"));
}

export function copyAsCaption({
  title,
  hooks,
  hashtags,
}: {
  title?: string;
  hooks?: string;
  hashtags?: string;
}) {
  const parts = [];

  if (title) parts.push(title);
  if (hooks) parts.push("\n" + hooks);
  if (hashtags) parts.push("\n\n" + hashtags);

  navigator.clipboard.writeText(parts.join("\n"));
}
