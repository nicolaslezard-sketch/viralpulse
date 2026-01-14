import { prisma } from "@/lib/prisma";

const TEMP_USER_ID = "user_1";

export async function getOrCreateUser() {
  let user = await prisma.user.findUnique({
    where: { id: TEMP_USER_ID },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: TEMP_USER_ID,
        plan: "free",
      },
    });
  }

  return user;
}
