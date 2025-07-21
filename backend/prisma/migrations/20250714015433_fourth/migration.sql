-- DropForeignKey
ALTER TABLE "LogicCondition" DROP CONSTRAINT "LogicCondition_questionId_fkey";

-- DropForeignKey
ALTER TABLE "LogicCondition" DROP CONSTRAINT "LogicCondition_triggerOptionId_fkey";

-- AddForeignKey
ALTER TABLE "LogicCondition" ADD CONSTRAINT "LogicCondition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogicCondition" ADD CONSTRAINT "LogicCondition_triggerOptionId_fkey" FOREIGN KEY ("triggerOptionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;
