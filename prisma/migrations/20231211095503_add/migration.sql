/*
  Warnings:

  - Added the required column `isDefault` to the `ProductSku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductSku` ADD COLUMN `isDefault` BOOLEAN NOT NULL;
