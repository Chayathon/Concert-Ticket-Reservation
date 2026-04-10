/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `Concert` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Concert" DROP COLUMN "availableSeats",
ADD COLUMN     "reserved" INTEGER NOT NULL DEFAULT 0;
