/*
  Warnings:

  - The `reportFull` column on the `AnalysisReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reportFree` column on the `AnalysisReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AnalysisReport" DROP COLUMN "reportFull",
ADD COLUMN     "reportFull" JSONB,
DROP COLUMN "reportFree",
ADD COLUMN     "reportFree" JSONB;
