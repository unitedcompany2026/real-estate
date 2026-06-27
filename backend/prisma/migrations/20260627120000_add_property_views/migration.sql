-- CreateTable
CREATE TABLE "property_views" (
    "id" SERIAL NOT NULL,
    "property_id" TEXT NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_views_property_id_idx" ON "property_views"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_views_property_id_ip_hash_key" ON "property_views"("property_id", "ip_hash");

-- AddForeignKey
ALTER TABLE "property_views" ADD CONSTRAINT "property_views_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
