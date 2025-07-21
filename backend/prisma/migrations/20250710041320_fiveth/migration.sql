-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "questionRequired" BOOLEAN,
ADD COLUMN     "questionTitle" TEXT,
ADD COLUMN     "sectionId" INTEGER,
ADD COLUMN     "sectionTitle" TEXT;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
