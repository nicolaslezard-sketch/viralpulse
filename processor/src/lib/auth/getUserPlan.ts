import { prisma } from "../prisma";

export type UserPlan = "free" | "plus" | "pro";

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const plan = String(user?.plan ?? "").toLowerCase();

  if (plan === "pro") return "pro";
  if (plan === "plus") return "plus";

  return "free";
}
