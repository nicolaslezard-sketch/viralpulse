"use client";

import CopyButton from "./CopyButton";

type Props = {
  analysis: string;
};

type SectionKey =
  | "SUMMARY"
  | "VIRAL REASON"
  | "KEY MOMENT"
  | "TITLE IDEAS"
  | "HASHTAGS"
  | "REMIX IDEAS"
  | "REACTION SCRIPT"
  | "MEME TEMPLATES"
  | "HOOKS"
  | "PREDICTED LONGEVITY"
  | "VIRALITY SCORE"
  | "WHAT TO FIX"
  | "PLATFORM STRATEGY"
  | "CLIP IDEAS"
  | "CONTENT ANGLE VARIATIONS"
  | "TARGET AUDIENCE FIT"
  | "FORMAT CLASSIFICATION"
  | "REPLICATION FRAMEWORK";

const ORDER: SectionKey[] = [
  "SUMMARY",
  "VIRAL REASON",
  "KEY MOMENT",
  "TITLE IDEAS",
  "HASHTAGS",
  "REMIX IDEAS",
  "REACTION SCRIPT",
  "MEME TEMPLATES",
  "HOOKS",
  "PREDICTED LONGEVITY",
  "VIRALITY SCORE",
  "WHAT TO FIX",
  "PLATFORM STRATEGY",
  "CLIP IDEAS",
  "CONTENT ANGLE VARIATIONS",
  "TARGET AUDIENCE FIT",
  "FORMAT CLASSIFICATION",
  "REPLICATION FRAMEWORK",
];

const GROUPS: Array<{
  title: string;
  subtitle: string;
  keys: SectionKey[];
}> = [
  {
    title: "UNDERSTAND",
    subtitle: "What it is, why it works, who it’s for",
    keys: ["SUMMARY", "VIRAL REASON", "FORMAT CLASSIFICATION", "TARGET AUDIENCE FIT"],
  },
  {
    title: "WHAT TO DO",
    subtitle: "Immediate improvements + ready-to-use assets",
    keys: ["WHAT TO FIX", "HOOKS", "TITLE IDEAS"],
  },
  {
    title: "CLIPS & REUSE",
    subtitle: "Cut points, reuse angles and remix options",
    keys: ["KEY MOMENT", "CLIP IDEAS", "REMIX IDEAS", "CONTENT ANGLE VARIATIONS"],
  },
  {
    title: "CREATIVE OUTPUTS",
    subtitle: "Scripts and meme-ready text",
    keys: ["REACTION SCRIPT", "MEME TEMPLATES"],
  },
  {
    title: "DISTRIBUTION",
    subtitle: "Where to post + discovery",
    keys: ["PLATFORM STRATEGY", "HASHTAGS", "PREDICTED LONGEVITY"],
  },
  {
    title: "REPLICATION",
    subtitle: "How to replicate this structure in future content",
    keys: ["REPLICATION FRAMEWORK"],
  },
];

function normalizeKey(raw: string): string {
  // Make matching more tolerant
  return raw
    .toUpperCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^A-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectKeyFromHeading(line: string): SectionKey | null {
  const cleaned = line
    .replace(/^#+\s*/, "")   // quita "## "
    .replace(/^\d+\)\s*/, "") // quita "1) "
    .trim();

  const normalized = normalizeKey(cleaned);

  const candidates: Array<{ key: SectionKey; match: string[] }> = [
    { key: "SUMMARY", match: ["SUMMARY"] },
    { key: "VIRAL REASON", match: ["VIRAL REASON"] },
    { key: "KEY MOMENT", match: ["KEY MOMENT"] },
    { key: "TITLE IDEAS", match: ["TITLE IDEAS"] },
    { key: "HASHTAGS", match: ["HASHTAGS"] },
    { key: "REMIX IDEAS", match: ["REMIX IDEAS"] },
    { key: "REACTION SCRIPT", match: ["REACTION SCRIPT"] },
    { key: "MEME TEMPLATES", match: ["MEME TEMPLATES"] },
    { key: "HOOKS", match: ["HOOKS"] },
    { key: "PREDICTED LONGEVITY", match: ["PREDICTED LONGEVITY"] },
    { key: "VIRALITY SCORE", match: ["VIRALITY SCORE"] },
    { key: "WHAT TO FIX", match: ["WHAT TO FIX"] },
    { key: "PLATFORM STRATEGY", match: ["PLATFORM STRATEGY"] },
    { key: "CLIP IDEAS", match: ["CLIP IDEAS"] },
    { key: "CONTENT ANGLE VARIATIONS", match: ["CONTENT ANGLE VARIATIONS"] },
    { key: "TARGET AUDIENCE FIT", match: ["TARGET AUDIENCE FIT"] },
    { key: "FORMAT CLASSIFICATION", match: ["FORMAT CLASSIFICATION"] },
    { key: "REPLICATION FRAMEWORK", match: ["REPLICATION FRAMEWORK"] },
  ];

  for (const c of candidates) {
    if (c.match.some((x) => normalized === x)) return c.key;
  }

  return null;
}

function parseSections(raw: string): Record<SectionKey, string> {
  const lines = raw.split("\n");
  const out: Partial<Record<SectionKey, string[]>> = {};
  let current: SectionKey | null = null;

  for (const line of lines) {
    const maybeKey = detectKeyFromHeading(line);
    if (maybeKey) {
      current = maybeKey;
      if (!out[current]) out[current] = [];
      continue;
    }
    if (current) out[current]!.push(line);
  }

  const final: Record<SectionKey, string> = {} as any;
  for (const k of ORDER) {
    const body = (out[k] ?? []).join("\n").trim();
    final[k] = body.length ? body : "(No content generated for this section.)";
  }
  return final;
}

function extractViralityScore(text: string): string | null {
  // Accept: "Virality Score: 7.8 / 10" or "7/10"
  const m =
    text.match(/(\d+(\.\d+)?)\s*\/\s*10/) ||
    text.match(/score\D+(\d+(\.\d+)?)/i);
  if (!m) return null;
  return m[1];
}

function extractLongevity(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("24–48") || t.includes("24-48")) return "24–48 hours";
  if (t.includes("3–5") || t.includes("3-5")) return "3–5 days";
  if (t.includes("1–2") || t.includes("1-2")) return "1–2 weeks";
  return null;
}

function extractBestPlatform(text: string): string | null {
  // Look for ratings like: "TikTok: ⭐⭐⭐⭐" or "TikTok: 5/5"
  const lower = text.toLowerCase();
  const platforms = ["tiktok", "instagram reels", "youtube shorts", "x", "twitter"] as const;

  let best: { name: string; score: number } | null = null;

  for (const p of platforms) {
    // stars
    const starLine = new RegExp(`${p.replace(/\s+/g, "\\s+")}\\s*:\\s*([⭐]+)`, "i").exec(text);
    if (starLine?.[1]) {
      const score = starLine[1].length;
      const name = p === "twitter" ? "X" : titleCase(p);
      if (!best || score > best.score) best = { name, score };
      continue;
    }

    // /5
    const fiveLine = new RegExp(`${p.replace(/\s+/g, "\\s+")}\\s*:\\s*(\\d)\\s*\\/\\s*5`, "i").exec(text);
    if (fiveLine?.[1]) {
      const score = Number(fiveLine[1]);
      const name = p === "twitter" ? "X" : titleCase(p);
      if (!best || score > best.score) best = { name, score };
      continue;
    }

    // "best for tiktok"
    if (lower.includes(`best for ${p}`)) {
      const name = p === "twitter" ? "X" : titleCase(p);
      if (!best) best = { name, score: 1 };
    }
  }

  return best?.name ?? null;
}

function titleCase(s: string) {
  return s
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function Card({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)",
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.85)",
        fontWeight: 800,
        fontSize: 12,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
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
      {text}
    </pre>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.2, fontWeight: 900, opacity: 0.9 }}>
          {title}
        </div>
        <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 13 }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

function Collapsible({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.02)",
        padding: 12,
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          fontWeight: 900,
        }}
      >
        <span>{title}</span>
        <span style={{ opacity: 0.65, fontSize: 12 }}>Toggle</span>
      </summary>
      <div style={{ marginTop: 10 }}>{children}</div>
    </details>
  );
}

export default function ResultBlock({ analysis }: Props) {
  const sections = parseSections(analysis);

  const score = extractViralityScore(sections["VIRALITY SCORE"]);
  const longevity = extractLongevity(sections["PREDICTED LONGEVITY"]);
  const bestPlatform = extractBestPlatform(sections["PLATFORM STRATEGY"]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Sticky summary header */}
      <div
        style={{
          position: "sticky",
          top: 10,
          zIndex: 5,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(15,15,22,0.92)",
          backdropFilter: "blur(10px)",
          padding: 12,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <Badge>Virality Score: {score ? `${score}/10` : "—"}</Badge>
          <Badge>Best Platform: {bestPlatform ?? "—"}</Badge>
          <Badge>Longevity: {longevity ?? "—"}</Badge>
          <div style={{ marginLeft: "auto" }}>
            <CopyButton text={analysis} label="Copy full report" />
          </div>
        </div>

        <div style={{ marginTop: 10, color: "rgba(255,255,255,0.70)", fontSize: 13 }}>
          Start here: <b>What To Fix</b> + <b>Hooks</b> + <b>Clip Ideas</b>.
        </div>
      </div>

      {GROUPS.map((g) => (
        <Section key={g.title} title={g.title} subtitle={g.subtitle}>
          <div style={{ display: "grid", gap: 12 }}>
            {g.keys.map((key) => {
              const text = sections[key];

              // Make heavy sections collapsible by default
              const shouldCollapse =
                key === "VIRAL REASON" ||
                key === "REMIX IDEAS" ||
                key === "HASHTAGS" ||
                key === "REPLICATION FRAMEWORK" ||
                key === "CLIP IDEAS";

              // Add copy buttons to “assets”
              const isCopyHeavy =
                key === "HOOKS" ||
                key === "TITLE IDEAS" ||
                key === "HASHTAGS" ||
                key === "REACTION SCRIPT" ||
                key === "MEME TEMPLATES" ||
                key === "WHAT TO FIX" ||
                key === "REPLICATION FRAMEWORK" ||
                key === "CLIP IDEAS";

              const body = (
                <Card
                  title={key}
                  right={isCopyHeavy ? <CopyButton text={text} /> : undefined}
                >
                  <TextBlock text={text} />
                </Card>
              );

              if (!shouldCollapse) return <div key={key}>{body}</div>;

              return (
                <div key={key}>
                  <Collapsible title={key} defaultOpen={key === "CLIP IDEAS"}>
                    <div style={{ display: "grid", gap: 10 }}>
                      {isCopyHeavy ? (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <CopyButton text={text} />
                        </div>
                      ) : null}
                      <TextBlock text={text} />
                    </div>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </Section>
      ))}
    </div>
  );
}
