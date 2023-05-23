/*
  Warnings:

  - Added the required column `bookId` to the `BuyRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BuyRequest" ADD COLUMN     "bookId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BuyRequest" ADD CONSTRAINT "BuyRequest_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
