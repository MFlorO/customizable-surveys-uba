/*
  Warnings:

  - Made the column `sectionId` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surveyId` on table `Section` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "sectionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "surveyId" SET NOT NULL;
