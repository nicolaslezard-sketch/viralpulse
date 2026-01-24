export function serializeReport(report: any): string {
  let output = "";

  for (const [sectionKey, section] of Object.entries(report)) {
    if (!section || typeof section !== "object") continue;

    const title = (section as any).title ?? sectionKey;
    const content = (section as any).content;

    output += `## ${title}\n\n`;

    if (Array.isArray(content)) {
      for (const item of content) {
        output += `- ${item}\n`;
      }
    } else if (typeof content === "string") {
      output += `${content}\n`;
    }

    output += `\n`;
  }

  return output.trim();
}
