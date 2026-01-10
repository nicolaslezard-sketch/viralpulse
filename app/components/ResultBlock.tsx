type Props = {
  analysis: string;
};

function splitIntoSections(raw: string) {
  // Esperamos headings tipo:
  // 1) SUMMARY
  // 2) VIRAL REASON (Why it is trending)
  const lines = raw.split("\n");
  const sections: { title: string; body: string }[] = [];

  let currentTitle = "RESULT";
  let currentBody: string[] = [];

  const headingRegex = /^\s*\d+\)\s+/;

  for (const line of lines) {
    if (headingRegex.test(line)) {
      // push previous
      if (currentBody.length > 0) {
        sections.push({ title: currentTitle.trim(), body: currentBody.join("\n").trim() });
      }
      currentTitle = line.trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentBody.length > 0) {
    sections.push({ title: currentTitle.trim(), body: currentBody.join("\n").trim() });
  }

  return sections.filter((s) => s.body.length > 0);
}

export default function ResultBlock({ analysis }: Props) {
  const sections = splitIntoSections(analysis);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {sections.map((s, idx) => (
        <div
          key={idx}
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            padding: 14,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8 }}>{s.title}</div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "rgba(255,255,255,0.85)",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {s.body}
          </pre>
        </div>
      ))}
    </div>
  );
}
