/*
  Warnings:

  - You are about to drop the column `code` on the `orderitem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `MidtransDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `code`;

-- CreateIndex
CREATE UNIQUE INDEX `MidtransDetail_code_key` ON `MidtransDetail`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_code_key` ON `Order`(`code`);
