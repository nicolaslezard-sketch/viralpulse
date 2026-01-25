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
        rounded-3xl
        border border-white/10
        bg-gradient-to-b from-zinc-900/80 to-zinc-950/90
        backdrop-blur-xl
        p-10
        text-center
        text-white
        shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]
      "
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20">
        <span className="text-3xl">🎉</span>
      </div>

      <h2 className="text-2xl font-bold">Your report is ready</h2>

      <p className="mt-3 text-zinc-400 max-w-md mx-auto">
        We’ve finished analyzing your content and generated actionable insights
        optimized for virality.
      </p>

      <div className="mt-8 flex justify-center">
        <a
          href={`/report/${reportId}`}
          className="
            inline-flex items-center justify-center
            rounded-full
            bg-gradient-to-r from-indigo-500 to-indigo-400
            px-8 py-3
            text-sm font-semibold text-white
            shadow-lg shadow-indigo-500/25
            hover:brightness-110
            transition
          "
        >
          View report →
        </a>
      </div>

      {!isPro && (
        <p className="mt-4 text-xs text-zinc-500">
          Preview available · Upgrade to unlock full access
        </p>
      )}
    </div>
  );
}
