/*
  Warnings:

  - Made the column `sectionId` on table `Answer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_sectionId_fkey";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "sectionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
