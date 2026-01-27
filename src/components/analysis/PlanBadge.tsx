import { type UserPlan } from "@/lib/useUserPlan";

const LABEL: Record<UserPlan, string> = {
  free: "Free",
  plus: "Plus",
  pro: "Pro",
};

export default function PlanBadge({ plan }: { plan: UserPlan }) {
  const label = LABEL[plan] ?? "Free";

  return (
    <div
      className="
        inline-flex items-center gap-2
        rounded-full px-3 py-1 text-xs font-medium
        bg-white/5 backdrop-blur
        border border-white/10
        shadow-[0_0_0_1px_rgba(255,255,255,0.04)]
      "
      aria-label={`Current plan: ${label}`}
      title={`Current plan: ${label}`}
    >
      <span className="h-2 w-2 rounded-full bg-white/50" />
      <span className="text-white/90">{label}</span>
    </div>
  );
}
