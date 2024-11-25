/*
  Warnings:

  - A unique constraint covering the columns `[referalCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `referalCode` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_referalCode_key` ON `User`(`referalCode`);
