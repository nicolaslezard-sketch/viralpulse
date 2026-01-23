"use client";

import { useState } from "react";

type Props = {
  text: string;
  label?: string;
};

export default function CopyButton({ text, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: do nothing (or could show a tiny error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        borderRadius: 10,
        padding: "8px 10px",
        border: "1px solid rgba(255,255,255,0.14)",
        background: copied ? "rgba(110,255,170,0.18)" : "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.9)",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 12,
      }}
      title="Copy to clipboard"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
