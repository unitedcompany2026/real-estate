/*
  Warnings:

  - A unique constraint covering the columns `[company_name]` on the table `partners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "partners_company_name_key" ON "partners"("company_name");
