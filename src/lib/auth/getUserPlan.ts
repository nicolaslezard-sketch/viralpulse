import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

export type UserPlan = "free" | "plus" | "pro";

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (user?.plan === Plan.pro) return "pro";
  if (user?.plan === Plan.plus) return "plus";

  return "free";
}
