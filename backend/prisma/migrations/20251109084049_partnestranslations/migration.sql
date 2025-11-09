-- CreateTable
CREATE TABLE "partner_translations" (
    "id" SERIAL NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "partner_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partner_translations_partner_id_language_key" ON "partner_translations"("partner_id", "language");

-- AddForeignKey
ALTER TABLE "partner_translations" ADD CONSTRAINT "partner_translations_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
