export function useUserPlan() {
  // TEMPORAL — luego viene auth real
  return {
    plan: "free" as "free" | "pro",
  };
}
