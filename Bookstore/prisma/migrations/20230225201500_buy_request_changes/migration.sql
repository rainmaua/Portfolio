/*
  Warnings:

  - The primary key for the `BuyRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sellerId` on the `BuyRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BuyRequest" DROP CONSTRAINT "BuyRequest_sellerId_fkey";

-- AlterTable
ALTER TABLE "BuyRequest" DROP CONSTRAINT "BuyRequest_pkey",
DROP COLUMN "sellerId",
ADD CONSTRAINT "BuyRequest_pkey" PRIMARY KEY ("buyerId", "bookId");
