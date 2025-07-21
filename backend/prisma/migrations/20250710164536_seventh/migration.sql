-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "logicAction" "LogicAction",
ADD COLUMN     "logicApplied" BOOLEAN,
ADD COLUMN     "logicTargetId" INTEGER;
