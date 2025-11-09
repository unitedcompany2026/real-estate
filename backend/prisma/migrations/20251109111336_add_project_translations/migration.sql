/*
  Warnings:

  - You are about to drop the column `partnerId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `project-location` on the `projects` table. All the data in the column will be lost.
  - Added the required column `partner_id` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_location` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_partnerId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "partnerId",
DROP COLUMN "project-location",
ADD COLUMN     "partner_id" INTEGER NOT NULL,
ADD COLUMN     "project_location" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "project_translations" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_location" TEXT NOT NULL,

    CONSTRAINT "project_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_translations_project_id_language_key" ON "project_translations"("project_id", "language");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
