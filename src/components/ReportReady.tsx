"use client";

export default function ReportReady({
  reportId,
  isPro,
}: {
  reportId: string;
  isPro: boolean;
}) {
  return (
    <div
      className="
        mt-14
        mx-auto max-w-xl
        rounded-3xl
        border border-emerald-400/20
        bg-black/60
        backdrop-blur-xl
        p-10
        text-center
        text-white
        shadow-[0_0_80px_rgba(16,185,129,0.15)]
      "
    >
      {/* Icon */}
      <div className="mx-auto mb-5 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
          <span className="text-2xl font-bold text-emerald-400">✓</span>
        </div>
      </div>

      {/* Eyebrow */}
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400/80">
        Report ready
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold tracking-tight">
        Your report is ready
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-md mx-auto text-sm text-zinc-400">
        We’ve finished analyzing your content and generated clear,
        actionable insights optimized for virality.
      </p>

      {/* CTA */}
      <div className="mt-8 flex justify-center">
        <a
          href={`/report/${reportId}`}
          className="
            inline-flex items-center gap-2
            rounded-2xl
            bg-indigo-500 px-8 py-3
            text-sm font-semibold text-white
            transition
            hover:bg-indigo-400
            hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
          "
        >
          Open report
          <span>→</span>
        </a>
      </div>

      {/* Upsell note */}
      {!isPro && (
        <p className="mt-4 text-xs text-zinc-500">
          Preview available · Upgrade to unlock full access
        </p>
      )}
    </div>
  );
}
