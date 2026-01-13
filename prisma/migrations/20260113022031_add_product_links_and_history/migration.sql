/*
  Warnings:

  - You are about to drop the column `shopeeLink` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `tokpedLink` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shopeeLink` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tokpedLink` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MarketplaceType" AS ENUM ('SHOPEE', 'TOKOPEDIA', 'TIKTOK', 'LAZADA', 'BLIBLI', 'WEBSITE_RESMI', 'WHATSAPP_LOKAL', 'OFFLINE_STORE');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "shopeeLink",
DROP COLUMN "tokpedLink",
ADD COLUMN     "referenceLink" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
DROP COLUMN "shopeeLink",
DROP COLUMN "tokpedLink",
ADD COLUMN     "maxPrice" DECIMAL(15,2),
ADD COLUMN     "minPrice" DECIMAL(15,2);

-- AlterTable
ALTER TABLE "SiteSetting" ALTER COLUMN "siteName" SET DEFAULT 'Jagopilih',
ALTER COLUMN "footerAbout" SET DEFAULT 'Kurasi harga jujur dan toko lokal terpercaya.',
ALTER COLUMN "heroTitle" SET DEFAULT 'Cek Harga Asli, Bukan Harga Diskon Palsu.',
ALTER COLUMN "heroPromo" SET DEFAULT 'Data Real-Time',
ALTER COLUMN "heroDescription" SET DEFAULT 'Bandingkan harga marketplace nasional dengan toko tetangga Anda.',
ALTER COLUMN "primaryBtnText" SET DEFAULT 'Cari Produk';

-- CreateTable
CREATE TABLE "ProductLink" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "marketplace" "MarketplaceType" NOT NULL,
    "storeName" TEXT NOT NULL,
    "region" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "originalUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "currentPrice" DECIMAL(15,2) NOT NULL,
    "isStockReady" BOOLEAN NOT NULL DEFAULT true,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" SERIAL NOT NULL,
    "productLinkId" TEXT NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceHistory_productLinkId_recordedAt_idx" ON "PriceHistory"("productLinkId", "recordedAt");

-- AddForeignKey
ALTER TABLE "ProductLink" ADD CONSTRAINT "ProductLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_productLinkId_fkey" FOREIGN KEY ("productLinkId") REFERENCES "ProductLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
