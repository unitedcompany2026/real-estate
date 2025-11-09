/*
  Warnings:

  - You are about to drop the column `age` on the `partners` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `partners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" DROP COLUMN "age",
DROP COLUMN "phone";
