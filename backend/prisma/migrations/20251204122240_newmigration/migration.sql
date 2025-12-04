-- CreateTable
CREATE TABLE "homepage_slides" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_slide_translations" (
    "id" SERIAL NOT NULL,
    "slide_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "homepage_slide_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_slide_translations_slide_id_language_key" ON "homepage_slide_translations"("slide_id", "language");

-- AddForeignKey
ALTER TABLE "homepage_slide_translations" ADD CONSTRAINT "homepage_slide_translations_slide_id_fkey" FOREIGN KEY ("slide_id") REFERENCES "homepage_slides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
