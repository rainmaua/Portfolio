/*
  Warnings:

  - Added the required column `sellerId` to the `BuyRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BuyRequest" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BuyRequest" ADD CONSTRAINT "BuyRequest_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
