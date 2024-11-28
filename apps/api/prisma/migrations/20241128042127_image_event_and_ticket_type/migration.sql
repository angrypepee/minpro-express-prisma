/*
  Warnings:

  - You are about to alter the column `type` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - Added the required column `image` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Ticket` MODIFY `type` ENUM('VIP', 'GENERAL', 'EARLY_BIRD') NOT NULL;
