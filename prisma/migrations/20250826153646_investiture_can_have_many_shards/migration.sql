/*
  Warnings:

  - You are about to drop the column `shardId` on the `Investiture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Investiture" DROP CONSTRAINT "Investiture_shardId_fkey";

-- AlterTable
ALTER TABLE "public"."Investiture" DROP COLUMN "shardId";

-- CreateTable
CREATE TABLE "public"."ShardInvestiture" (
    "id" TEXT NOT NULL,
    "investitureId" TEXT NOT NULL,
    "shardId" TEXT NOT NULL,

    CONSTRAINT "ShardInvestiture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShardInvestiture_investitureId_shardId_key" ON "public"."ShardInvestiture"("investitureId", "shardId");

-- AddForeignKey
ALTER TABLE "public"."ShardInvestiture" ADD CONSTRAINT "ShardInvestiture_investitureId_fkey" FOREIGN KEY ("investitureId") REFERENCES "public"."Investiture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShardInvestiture" ADD CONSTRAINT "ShardInvestiture_shardId_fkey" FOREIGN KEY ("shardId") REFERENCES "public"."Shard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
