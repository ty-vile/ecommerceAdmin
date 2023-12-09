/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`,
    ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
