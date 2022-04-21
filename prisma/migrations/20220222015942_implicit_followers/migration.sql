/*
  Warnings:

  - You are about to drop the `follower` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `follower` DROP FOREIGN KEY `Follower_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `follower` DROP FOREIGN KEY `Follower_vendorId_fkey`;

-- DropTable
DROP TABLE `follower`;

-- CreateTable
CREATE TABLE `__Followers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `__Followers_AB_unique`(`A`, `B`),
    INDEX `__Followers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `__Followers` ADD FOREIGN KEY (`A`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `__Followers` ADD FOREIGN KEY (`B`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
