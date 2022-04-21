/*
  Warnings:

  - You are about to drop the column `vendorId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `MidtransDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_vendorId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `vendorId`;

-- CreateIndex
CREATE UNIQUE INDEX `MidtransDetail_orderId_key` ON `MidtransDetail`(`orderId`);
