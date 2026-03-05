export function LockedCard({ title }: { title: string }) {
  return (
    <div className="relative rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/10 overflow-hidden">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <div className="h-20 bg-white/5 rounded blur-sm" />

      <div className="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
        <div className="text-lg font-semibold mb-2">🔒 Premium Insight</div>

        <p className="text-sm text-white/70 mb-3">
          Upgrade to unlock this strategy insight.
        </p>

        <a
          href="/pricing"
          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium"
        >
          Upgrade Plan
        </a>
      </div>
    </div>
  );
}
