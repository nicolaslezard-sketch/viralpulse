"use client";

import { useCallback, useEffect, useState } from "react";

export type UserPlan = "free" | "plus" | "pro";

export function useUserPlan() {
  const [plan, setPlan] = useState<UserPlan>("free");
  const [hasCard, setHasCard] = useState(false);
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
    } catch {
      setPlan("free");
      setHasCard(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    plan,

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
