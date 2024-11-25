/*
  Warnings:

  - You are about to drop the column `referalCode` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_referalCode_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `referalCode`,
    ADD COLUMN `balance` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `referralCode` VARCHAR(191) NULL,
    ADD COLUMN `referredBy` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_referralCode_key` ON `User`(`referralCode`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredBy_fkey` FOREIGN KEY (`referredBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
