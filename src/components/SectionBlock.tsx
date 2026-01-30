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
  const shouldTrim = !isPro && previewRatio < 1 && title !== "SUMMARY";

  const previewText = shouldTrim
    ? content.slice(0, Math.floor(content.length * previewRatio))
    : content;

  async function handleUpgrade() {
    const res = await fetch("/api/lemon/checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        border border-white/10
        bg-gradient-to-b from-zinc-900/70 to-zinc-950/90
        backdrop-blur-xl
        p-8
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-white/20
        hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]
      "
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{meta?.icon}</span>
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {meta?.label || title}
          </h3>
        </div>

        {!isPro && shouldTrim && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-300">
            PRO feature
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="relative">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
          {previewText}
          {shouldTrim && (
            <span className="ml-1 italic text-zinc-500">
              …unlock full insights →
            </span>
          )}
        </div>

        {shouldTrim && (
          <div
            className="
              mt-3
              whitespace-pre-wrap
              text-sm
              leading-relaxed
              text-zinc-400/70
              blur-[3px]
              opacity-70
              select-none
              pointer-events-none
              [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.85),rgba(0,0,0,0.0))]
            "
          >
            {content.slice(previewText.length)}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <CopyButton
          text={previewText}
          label={isPro ? "Copy section" : "Copy preview"}
        />

        {shouldTrim && (
          <button
            onClick={handleUpgrade}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:brightness-110 transition"
          >
            Unlock full report
          </button>
        )}
      </div>
    </div>
  );
}
