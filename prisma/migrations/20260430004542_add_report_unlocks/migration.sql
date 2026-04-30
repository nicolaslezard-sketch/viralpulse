-- AlterTable
ALTER TABLE "AnalysisReport" ADD COLUMN     "freeFullPreview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lemonOrderId" TEXT,
ADD COLUMN     "oneShotUnlocked" BOOLEAN NOT NULL DEFAULT false;
