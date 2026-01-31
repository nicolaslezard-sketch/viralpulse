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
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/user-status", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      const nextPlan: UserPlan =
        data?.plan === "pro" || data?.plan === "plus" ? data.plan : "free";

      setPlan(nextPlan);

      // Snapshot de uso
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
      // fallback seguro
      setPlan("free");
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

    // 🔓 acceso por plan (NO por tarjeta)
    isPaid: plan !== "free",
    isPlus: plan === "plus",
    isPro: plan === "pro",

    isLoading,
    refresh: fetchStatus,
  };
}
