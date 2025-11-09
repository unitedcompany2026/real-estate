-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_partnerId_fkey";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
