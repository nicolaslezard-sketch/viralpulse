"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-white/60 hover:text-white border border-white/10 px-2 py-1 rounded-md hover:border-white/20 transition"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
