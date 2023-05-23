/*
  Warnings:

  - You are about to drop the column `date_created` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `date_updated` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `date_created` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `date_updated` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `date_created` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `date_created` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `date_updated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone_num` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNum` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "date_created",
DROP COLUMN "date_updated",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "date_created",
DROP COLUMN "date_updated",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "date_created",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "date_created",
DROP COLUMN "date_updated",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "phone_num",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phoneNum" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BuyRequest" (
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BuyRequest_pkey" PRIMARY KEY ("sellerId","buyerId")
);

-- AddForeignKey
ALTER TABLE "BuyRequest" ADD CONSTRAINT "BuyRequest_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyRequest" ADD CONSTRAINT "BuyRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
