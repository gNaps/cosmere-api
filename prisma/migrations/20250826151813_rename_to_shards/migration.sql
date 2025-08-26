/*
  Warnings:

  - You are about to drop the column `fragmentId` on the `Investiture` table. All the data in the column will be lost.
  - You are about to drop the `Fragment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanetFragment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Investiture" DROP CONSTRAINT "Investiture_fragmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlanetFragment" DROP CONSTRAINT "PlanetFragment_fragmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlanetFragment" DROP CONSTRAINT "PlanetFragment_planetId_fkey";

-- AlterTable
ALTER TABLE "public"."Investiture" DROP COLUMN "fragmentId",
ADD COLUMN     "shardId" TEXT;

-- DropTable
DROP TABLE "public"."Fragment";

-- DropTable
DROP TABLE "public"."PlanetFragment";

-- CreateTable
CREATE TABLE "public"."Shard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "imageCredit" TEXT,

    CONSTRAINT "Shard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanetShard" (
    "id" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "shardId" TEXT NOT NULL,

    CONSTRAINT "PlanetShard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanetShard_planetId_shardId_key" ON "public"."PlanetShard"("planetId", "shardId");

-- AddForeignKey
ALTER TABLE "public"."Investiture" ADD CONSTRAINT "Investiture_shardId_fkey" FOREIGN KEY ("shardId") REFERENCES "public"."Shard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanetShard" ADD CONSTRAINT "PlanetShard_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "public"."Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanetShard" ADD CONSTRAINT "PlanetShard_shardId_fkey" FOREIGN KEY ("shardId") REFERENCES "public"."Shard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
