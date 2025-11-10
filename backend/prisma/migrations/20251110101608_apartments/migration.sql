-- CreateTable
CREATE TABLE "apartments" (
    "id" SERIAL NOT NULL,
    "room" INTEGER NOT NULL,
    "area" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "total_floors" INTEGER NOT NULL,
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartment_translations" (
    "id" SERIAL NOT NULL,
    "apartment_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "apartment_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apartment_translations_apartment_id_language_key" ON "apartment_translations"("apartment_id", "language");

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apartment_translations" ADD CONSTRAINT "apartment_translations_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
