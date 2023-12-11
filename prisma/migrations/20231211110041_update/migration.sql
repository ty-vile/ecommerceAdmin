/*
  Warnings:

  - You are about to drop the column `userId` on the `ProductAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProductAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProductSku` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `ProductAttribute_userId_idx` ON `ProductAttribute`;

-- DropIndex
DROP INDEX `ProductAttributeValue_userId_idx` ON `ProductAttributeValue`;

-- DropIndex
DROP INDEX `ProductSku_userId_idx` ON `ProductSku`;

-- AlterTable
ALTER TABLE `ProductAttribute` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `ProductAttributeValue` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `ProductSku` DROP COLUMN `userId`;
