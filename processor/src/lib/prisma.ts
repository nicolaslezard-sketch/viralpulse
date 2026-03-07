import "dotenv/config";
import { PrismaClient } from "@prisma/client";

declare global {
  var __vpProcessorPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__vpProcessorPrisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__vpProcessorPrisma = prisma;
}
