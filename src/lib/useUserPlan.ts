"use client";

import { useState } from "react";

export type UserPlan = "free" | "plus" | "pro";

export function useUserPlan() {
  // ⚠️ temporal hasta que expongamos un endpoint real
  const [plan] = useState<UserPlan>("free");

  return {
    plan,
    isPaid: plan !== "free",
    isPlus: plan === "plus",
    isPro: plan === "pro",
    usage: null,
    isLoading: false,
    refresh: () => {},
  };
}
