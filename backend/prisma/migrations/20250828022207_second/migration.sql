/*
  Warnings:

  - You are about to drop the column `parentOptionId` on the `Option` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Option" DROP CONSTRAINT "Option_parentOptionId_fkey";

-- AlterTable
ALTER TABLE "public"."Option" DROP COLUMN "parentOptionId";

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT false;
