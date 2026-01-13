"use client";

import { SECTION_META } from "./sectionConfig";
import { useUserPlan } from "@/lib/useUserPlan";
import { copyPlain, copyList } from "@/lib/copyHelpers";

export default function SectionBlock({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const meta = SECTION_META[title];
  const { plan } = useUserPlan();

  const previewRatio = meta?.freePreviewRatio ?? 1;
  const isFree = plan !== "pro";
  const shouldTrim = isFree && previewRatio < 1;

  const previewText = shouldTrim
    ? content.slice(0, Math.floor(content.length * previewRatio))
    : content;

  function handleUpgrade() {
    fetch("/api/stripe/setup-checkout", {
      method: "POST",
    }).then(async (r) => {
      const d = await r.json();
      if (d?.url) window.location.href = d.url;
    });
  }
const actions = meta?.copyActions ?? ["copy"];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      {/* HEADER */}
      <div className="mb-3 flex items-center gap-2 text-white">
        <span className="text-lg">{meta?.icon}</span>
        <h3 className="text-lg font-semibold">
          {meta?.label || title}
        </h3>
      </div>

      {/* CONTENT */}
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
        {previewText}
        {shouldTrim && (
          <span className="text-zinc-500 italic">
            {" "}
            …unlock full insights with Pro
          </span>
        )}
      </div>

{/* COPY ACTIONS */}
<div className="mt-4 flex flex-wrap gap-2">
  {actions.includes("copy") && (
    <button
      onClick={() => copyPlain(previewText)}
      className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
    >
      Copy section
    </button>
  )}

  {actions.includes("copy_titles") && (
    <button
      onClick={() => copyList(previewText)}
      className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
    >
      Copy titles
    </button>
  )}

  {actions.includes("copy_hooks") && (
    <button
      onClick={() => copyList(previewText)}
      className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
    >
      Copy hooks
    </button>
  )}

  {actions.includes("copy_hashtags") && (
    <button
      onClick={() => copyPlain(previewText.replace(/\s+/g, " "))}
      className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
    >
      Copy hashtags
    </button>
  )}
</div>

      {/* CTA */}
      {shouldTrim && (
        <button
          onClick={handleUpgrade}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  );
}
