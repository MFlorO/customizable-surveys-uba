/*
  Warnings:

  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Answer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `logicTargetId` column on the `Answer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `LogicCondition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `LogicCondition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `targetQuestionId` column on the `LogicCondition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `targetSectionId` column on the `LogicCondition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Option` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Section` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Section` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Survey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Survey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SurveyResponse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SurveyResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `responseId` on the `Answer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `questionId` on the `Answer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sectionId` on the `Answer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `questionId` on the `LogicCondition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `triggerOptionId` on the `LogicCondition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `questionId` on the `Option` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sectionId` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `surveyId` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `surveyId` on the `SurveyResponse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_responseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LogicCondition" DROP CONSTRAINT "LogicCondition_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LogicCondition" DROP CONSTRAINT "LogicCondition_triggerOptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SurveyResponse" DROP CONSTRAINT "SurveyResponse_surveyId_fkey";

-- AlterTable
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "responseId",
ADD COLUMN     "responseId" INTEGER NOT NULL,
DROP COLUMN "questionId",
ADD COLUMN     "questionId" INTEGER NOT NULL,
DROP COLUMN "sectionId",
ADD COLUMN     "sectionId" INTEGER NOT NULL,
DROP COLUMN "logicTargetId",
ADD COLUMN     "logicTargetId" INTEGER,
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."LogicCondition" DROP CONSTRAINT "LogicCondition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "questionId",
ADD COLUMN     "questionId" INTEGER NOT NULL,
DROP COLUMN "triggerOptionId",
ADD COLUMN     "triggerOptionId" INTEGER NOT NULL,
DROP COLUMN "targetQuestionId",
ADD COLUMN     "targetQuestionId" INTEGER,
DROP COLUMN "targetSectionId",
ADD COLUMN     "targetSectionId" INTEGER,
ADD CONSTRAINT "LogicCondition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Option" DROP CONSTRAINT "Option_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "questionId",
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "sectionId",
ADD COLUMN     "sectionId" INTEGER NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "surveyId",
ADD COLUMN     "surveyId" INTEGER NOT NULL,
ADD CONSTRAINT "Section_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Survey" DROP CONSTRAINT "Survey_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Survey_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."SurveyResponse" DROP CONSTRAINT "SurveyResponse_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "surveyId",
ADD COLUMN     "surveyId" INTEGER NOT NULL,
ADD CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LogicCondition" ADD CONSTRAINT "LogicCondition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LogicCondition" ADD CONSTRAINT "LogicCondition_triggerOptionId_fkey" FOREIGN KEY ("triggerOptionId") REFERENCES "public"."Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."SurveyResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
