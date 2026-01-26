-- AlterEnum
ALTER TYPE "Plan" ADD VALUE 'plus';

-- DropForeignKey
ALTER TABLE "AnalysisReport" DROP CONSTRAINT "AnalysisReport_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "usageMonth" TEXT,
ADD COLUMN     "usedMinutesThisMonth" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DailyUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyUsage_userId_day_key" ON "DailyUsage"("userId", "day");

-- AddForeignKey
ALTER TABLE "AnalysisReport" ADD CONSTRAINT "AnalysisReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyUsage" ADD CONSTRAINT "DailyUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
