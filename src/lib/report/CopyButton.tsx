"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
