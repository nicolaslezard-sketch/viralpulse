"use client";

import { useSession } from "next-auth/react";
import type { UserPlan } from "@/lib/types";

const VALID_PLANS: UserPlan[] = ["free", "plus", "pro"];

function normalizePlan(plan: unknown): UserPlan {
  return VALID_PLANS.includes(plan as UserPlan) ? (plan as UserPlan) : "free";
}

export function useUserPlan() {
  const { data: session, status } = useSession();

  const plan = normalizePlan(session?.user?.plan);

  return {
    plan,
    isLoading: status === "loading",

    // flags simples
    isPaid: plan !== "free",
    isPlus: plan === "plus",
    isPro: plan === "pro",
  };
}

export type { UserPlan };
