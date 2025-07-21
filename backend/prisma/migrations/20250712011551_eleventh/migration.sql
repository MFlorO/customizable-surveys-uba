/*
  Warnings:

  - Made the column `surveyId` on table `Section` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "surveyId" SET NOT NULL;
