/*
  Warnings:

  - You are about to drop the column `complete` on the `BuyRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BuyRequest" DROP COLUMN "complete",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
