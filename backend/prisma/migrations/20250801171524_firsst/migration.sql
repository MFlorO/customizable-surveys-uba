-- CreateEnum
CREATE TYPE "public"."SurveyStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('TEXT', 'TEXT_LIMITED', 'NUMBER', 'NUMBER_LIMITED', 'SELECT_ONE', 'SELECT_MULTIPLE');

-- CreateEnum
CREATE TYPE "public"."LogicAction" AS ENUM ('FINALIZE', 'DISABLE_QUESTION', 'ENABLE_QUESTION', 'DISABLE_SECTION');

-- CreateTable
CREATE TABLE "public"."Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."SurveyStatus" NOT NULL DEFAULT 'DRAFT',
    "isEnable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "surveyId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."QuestionType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "characterLimit" INTEGER,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Option" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    "isCustomText" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LogicCondition" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "triggerOptionId" TEXT NOT NULL,
    "action" "public"."LogicAction" NOT NULL,
    "targetQuestionId" TEXT,
    "targetSectionId" TEXT,

    CONSTRAINT "LogicCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyResponse" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Answer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionCodes" INTEGER[],
    "textAnswer" TEXT,
    "numericAnswer" DOUBLE PRECISION,
    "questionTitle" TEXT,
    "sectionId" TEXT NOT NULL,
    "sectionTitle" TEXT,
    "questionRequired" BOOLEAN,
    "logicApplied" BOOLEAN DEFAULT false,
    "logicAction" "public"."LogicAction",
    "logicTargetId" TEXT,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_id_key" ON "public"."Section"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_key" ON "public"."Question"("id");

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
