/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `paket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "paket_code_key" ON "paket"("code");
