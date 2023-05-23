/*
  Warnings:

  - The primary key for the `BuyRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BuyRequest" DROP CONSTRAINT "BuyRequest_pkey",
ADD CONSTRAINT "BuyRequest_pkey" PRIMARY KEY ("sellerId", "buyerId", "bookId");
