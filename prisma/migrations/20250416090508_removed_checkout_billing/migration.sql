/*
  Warnings:

  - You are about to drop the column `depositAmount` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `requiresDeposit` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `depositAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `depositPaid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingInfo` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "depositAmount",
DROP COLUMN "requiresDeposit";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "depositAmount",
DROP COLUMN "depositPaid";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "billingInfo";
