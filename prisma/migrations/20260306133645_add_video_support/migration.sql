-- AlterTable
ALTER TABLE "AnalysisReport" ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mediaKey" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "sourceType" TEXT,
ALTER COLUMN "audioKey" DROP NOT NULL,
ALTER COLUMN "durationSec" DROP NOT NULL;
