/*
  Warnings:

  - You are about to drop the column `data` on the `Viagem` table. All the data in the column will be lost.
  - Added the required column `dataRetorno` to the `Viagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataSaida` to the `Viagem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Viagem" DROP COLUMN "data",
ADD COLUMN     "dataRetorno" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataSaida" TIMESTAMP(3) NOT NULL;
