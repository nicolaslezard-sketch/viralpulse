"use client";

import { SECTION_META } from "./sectionConfig";
import CopyButton from "@/components/CopyButton";

export default function SectionBlock({
  title,
  content,
  isPro,
}: {
  title: string;
  content: string;
  isPro: boolean;
}) {
  const meta = SECTION_META[title];

  const previewRatio = meta?.freePreviewRatio ?? 1;
const shouldTrim =
  !isPro &&
  previewRatio < 1 &&
  title !== "SUMMARY";

  const previewText = shouldTrim
    ? content.slice(0, Math.floor(content.length * previewRatio))
    : content;

  function handleUpgrade() {
    fetch("/api/stripe/setup-checkout", { method: "POST" }).then(async (r) => {
      const d = await r.json();
      if (d?.url) window.location.href = d.url;
    });
  }

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/10
        bg-gradient-to-b from-zinc-900/80 to-zinc-950/90
        backdrop-blur-xl
        p-6
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-white/20
        hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]
      "
    >
      {/* HEADER */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xl">{meta?.icon}</span>
        <h3 className="text-lg font-semibold text-white">
          {meta?.label || title}
        </h3>
      </div>

      {/* CONTENT */}
      <div className="whitespace-pre-wrap text-sm text-zinc-300">
        {previewText}
        {shouldTrim && (
          <span className="ml-1 text-zinc-500 italic">
…unlock full insights →
          </span>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <CopyButton
          text={previewText}
          label={isPro ? "Copy section" : "Copy preview"}
        />

        {shouldTrim && (
          <button
            onClick={handleUpgrade}
            className="
              rounded-full
              bg-gradient-to-r from-indigo-500 to-indigo-400
              px-5 py-2
              text-sm font-semibold text-white
              shadow-lg shadow-indigo-500/20
              hover:brightness-110
            "
          >
            Unlock full report
          </button>
        )}
      </div>
    </div>
  );
}
