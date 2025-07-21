-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "sectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "surveyId" DROP NOT NULL;
