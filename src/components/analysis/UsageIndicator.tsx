import { MONTHLY_MINUTES_BY_PLAN, FREE_DAILY_ANALYSIS_LIMIT } from "@/lib/planLimits";

export type UsageSnapshot =
  | {
      plan: "free";
      freeDailyUsed: number;
      freeDailyRemaining: number;
    }
  | {
      plan: "plus" | "pro";
      usedMinutesThisMonth: number;
    };

function clampInt(n: unknown) {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.floor(v));
}

export default function UsageIndicator({ usage }: { usage: UsageSnapshot }) {
  if (usage.plan === "free") {
    const used = clampInt(usage.freeDailyUsed);
    const left = clampInt(usage.freeDailyRemaining);

    return (
      <div className="text-left sm:text-right">
        <div className="text-xs text-white/60">Today</div>
        <div className="text-sm font-medium text-white/90">
          {left} {left === 1 ? "analysis" : "analyses"} left
        </div>
        <div className="mt-0.5 text-xs text-white/50">
          {used} / {FREE_DAILY_ANALYSIS_LIMIT} used
        </div>
      </div>
    );
  }

  const limit = MONTHLY_MINUTES_BY_PLAN[usage.plan];
  const used = clampInt(usage.usedMinutesThisMonth);
  const left = Math.max(0, limit - used);

  return (
    <div className="text-left sm:text-right">
      <div className="text-xs text-white/60">Minutes</div>
      <div className="text-sm font-medium text-white/90">
        {used} / {limit} used · {left} left
      </div>
    </div>
  );
}
