/*
  Warnings:

  - You are about to drop the column `orderId` on the `midtransdetail` table. All the data in the column will be lost.
  - Added the required column `paymentUrl` to the `MidtransDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `midtransdetail` DROP FOREIGN KEY `MidtransDetail_orderId_fkey`;

-- AlterTable
ALTER TABLE `midtransdetail` DROP COLUMN `orderId`,
    ADD COLUMN `isPaid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `paymentType` VARCHAR(191) NULL,
    ADD COLUMN `paymentUrl` VARCHAR(191) NOT NULL,
    MODIFY `token` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `MidtransDetail` ADD CONSTRAINT `MidtransDetail_code_fkey` FOREIGN KEY (`code`) REFERENCES `Order`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;
