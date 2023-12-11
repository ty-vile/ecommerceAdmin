/*
  Warnings:

  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProductAttribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProductAttributeValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProductSku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductAttribute` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductAttributeValue` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductSku` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Product_userId_idx` ON `Product`(`userId`);

-- CreateIndex
CREATE INDEX `ProductAttribute_userId_idx` ON `ProductAttribute`(`userId`);

-- CreateIndex
CREATE INDEX `ProductAttributeValue_userId_idx` ON `ProductAttributeValue`(`userId`);

-- CreateIndex
CREATE INDEX `ProductSku_userId_idx` ON `ProductSku`(`userId`);
