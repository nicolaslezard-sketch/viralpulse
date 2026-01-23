import { prisma } from "@/lib/prisma";

export type UserPlan = "free" | "pro";

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (user?.plan === "pro") return "pro";
  return "free";
}
