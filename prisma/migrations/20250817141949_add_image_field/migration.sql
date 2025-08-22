/*
  Warnings:

  - Added the required column `name` to the `Fragment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "image" TEXT,
ADD COLUMN     "imageCredit" TEXT;

-- AlterTable
ALTER TABLE "public"."Fragment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "imageCredit" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Series" ADD COLUMN     "image" TEXT,
ADD COLUMN     "imageCredit" TEXT;
