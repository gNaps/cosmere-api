/*
  Warnings:

  - You are about to drop the column `planetId` on the `Series` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Series" DROP CONSTRAINT "Series_planetId_fkey";

-- AlterTable
ALTER TABLE "public"."Series" DROP COLUMN "planetId";

-- CreateTable
CREATE TABLE "public"."SeriesPlanet" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,

    CONSTRAINT "SeriesPlanet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeriesPlanet_seriesId_planetId_key" ON "public"."SeriesPlanet"("seriesId", "planetId");

-- AddForeignKey
ALTER TABLE "public"."SeriesPlanet" ADD CONSTRAINT "SeriesPlanet_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeriesPlanet" ADD CONSTRAINT "SeriesPlanet_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "public"."Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
