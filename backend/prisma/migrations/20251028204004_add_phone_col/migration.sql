/*
  Warnings:

  - Added the required column `phone` to the `partners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "phone" TEXT NOT NULL;
