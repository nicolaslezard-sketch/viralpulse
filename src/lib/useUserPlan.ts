"use client";

import { useCallback, useEffect, useState } from "react";

export type UserPlan = "free" | "plus" | "pro";

export type UserUsage =
  | {
      plan: "free";
      freeDailyUsed: number;
      freeDailyRemaining: number;
    }
  | {
      plan: "plus" | "pro";
      usedMinutesThisMonth: number;
      monthlyLimit: number;
      remainingMinutes: number;
    };

export function useUserPlan() {
  const [plan, setPlan] = useState<UserPlan>("free");
  const [hasCard, setHasCard] = useState(false);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user-status", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      const nextPlan =
        data?.plan === "pro" || data?.plan === "plus"
          ? (data.plan as UserPlan)
          : "free";

      setPlan(nextPlan);
      setHasCard(!!data?.hasCard);

      // Usage snapshot (best-effort; server returns zeros if unauthenticated)
      if (nextPlan === "free") {
        setUsage({
          plan: "free",
          freeDailyUsed: Number(data?.freeDailyUsed ?? 0),
          freeDailyRemaining: Number(data?.freeDailyRemaining ?? 0),
        });
      } else {
        setUsage({
          plan: nextPlan,
          usedMinutesThisMonth: Number(data?.usedMinutesThisMonth ?? 0),
          monthlyLimit: Number(data?.monthlyLimit ?? 0),
          remainingMinutes: Number(data?.remainingMinutes ?? 0),
        });
      }
    } catch {
      setPlan("free");
      setHasCard(false);
      setUsage({
        plan: "free",
        freeDailyUsed: 0,
        freeDailyRemaining: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    plan,
    usage,

    // 🔓 Pro y Plus desbloquean lo mismo a nivel features
    isPro: plan !== "free",

    // flags útiles si después querés diferenciar UX
    isPlus: plan === "plus",
    isProOnly: plan === "pro",

    hasCard,
    isLoading,
    refresh: fetchStatus,
  };
}
