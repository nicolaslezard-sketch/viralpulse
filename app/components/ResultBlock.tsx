type Props = {
  analysis: string;
};

function splitIntoSections(raw: string) {
  const lines = raw.split("\n");
  const sections: { title: string; body: string }[] = [];

  let currentTitle = "";
  let currentBody: string[] = [];

  const headingRegex = /^\s*\d+\)\s+/;

  for (const line of lines) {
    if (headingRegex.test(line)) {
      if (currentTitle && currentBody.length > 0) {
        sections.push({
          title: currentTitle.trim(),
          body: currentBody.join("\n").trim(),
        });
      }
      currentTitle = line.trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentTitle && currentBody.length > 0) {
    sections.push({
      title: currentTitle.trim(),
      body: currentBody.join("\n").trim(),
    });
  }

  return sections.filter((s) => s.body.length > 0);
}

export default function ResultBlock({ analysis }: Props) {
  const sections = splitIntoSections(analysis);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {sections.map((s, idx) => (
        <div
          key={idx}
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            padding: 18,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              marginBottom: 10,
              fontSize: 15,
              letterSpacing: 0.3,
            }}
          >
            {s.title}
          </div>

          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "rgba(255,255,255,0.85)",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"',
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            {s.body}
          </pre>
        </div>
      ))}
    </div>
  );
}
