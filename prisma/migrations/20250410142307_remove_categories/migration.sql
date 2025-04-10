/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreelancerCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FreelancerCategory" DROP CONSTRAINT "FreelancerCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "FreelancerCategory" DROP CONSTRAINT "FreelancerCategory_freelancerId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "FreelancerCategory";
