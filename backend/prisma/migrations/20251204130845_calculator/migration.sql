-- CreateTable
CREATE TABLE "mortgage_rates" (
    "id" SERIAL NOT NULL,
    "year_from" INTEGER NOT NULL,
    "year_to" INTEGER NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mortgage_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mortgage_rates_year_from_year_to_key" ON "mortgage_rates"("year_from", "year_to");
