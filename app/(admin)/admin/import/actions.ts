"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MarketplaceType } from "@prisma/client";

// Helper Slugify
function slugify(text: string) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     
    .replace(/[^\w-]+/g, "")  
    .replace(/--+/g, "-");    
}

export async function importProducts(rawRows: any[]) {
  try {
    let successCount = 0;
    let errorCount = 0;

    for (const rawRow of rawRows) {
      // 1. NORMALISASI KEYS (Lowercase & Trim)
      const row: any = {};
      Object.keys(rawRow).forEach((key) => {
        // Hapus spasi dan ubah ke lowercase (misal "Shopee URL " -> "shopee_url")
        const cleanKey = key.toLowerCase().trim().replace(/\s+/g, "_");
        row[cleanKey] = rawRow[key];
      });

      // 2. VALIDASI DASAR
      if (!row.name) {
        console.log("⚠️ Skip baris karena nama produk kosong");
        errorCount++;
        continue;
      }

      // 3. HANDLE KATEGORI (Find or Create)
      let categoryId = null;
      if (row.category) {
        const catSlug = slugify(row.category);
        const existingCat = await prisma.category.findFirst({ where: { slug: catSlug } });
        if (existingCat) {
          categoryId = existingCat.id;
        } else {
          const newCat = await prisma.category.create({
            data: { name: row.category, slug: catSlug }
          });
          categoryId = newCat.id;
        }
      }

      // 4. HANDLE IMAGES (Split by comma)
      let imagesList: string[] = [];
      if (row.images) {
        imagesList = String(row.images).split(",").map(url => url.trim());
      }

      // 5. KONSTRUKSI LINKS & HARGA
      const linksToCreate: any[] = [];
      
      // Mapping logic: Check kolom excel untuk marketplace tertentu
      // Format Excel: shopee_url, shopee_price, shopee_store, shopee_affiliate
      
      const marketplaces: Record<string, MarketplaceType> = {
        'shopee': 'SHOPEE',
        'tokped': 'TOKOPEDIA',
        'tokopedia': 'TOKOPEDIA',
        'tiktok': 'TIKTOK',
        'lazada': 'LAZADA',
        'blibli': 'BLIBLI',
        'wa': 'WHATSAPP_LOKAL',
        'website': 'WEBSITE_RESMI'
      };

      Object.keys(marketplaces).forEach((prefix) => {
        const urlKey = `${prefix}_url`;
        const priceKey = `${prefix}_price`;
        const storeKey = `${prefix}_store`;
        const affiliateKey = `${prefix}_affiliate`;
        const regionKey = `${prefix}_region`;

        if (row[urlKey]) { // Jika ada URL, berarti ada data link
            linksToCreate.push({
                marketplace: marketplaces[prefix],
                originalUrl: String(row[urlKey]),
                affiliateUrl: row[affiliateKey] ? String(row[affiliateKey]) : null,
                currentPrice: row[priceKey] ? Number(row[priceKey]) : 0,
                storeName: row[storeKey] ? String(row[storeKey]) : `${prefix.toUpperCase()} Store`, // Default store name
                region: row[regionKey] ? String(row[regionKey]) : null,
                isVerified: true, // Default true jika import bulk (asumsi kurasi admin)
                isStockReady: true
            });
        }
      });

      // 6. HITUNG MIN & MAX PRICE
      let minPrice = 0;
      let maxPrice = 0;
      if (linksToCreate.length > 0) {
        const prices = linksToCreate.map(l => l.currentPrice);
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
      }

      // 7. SIMPAN PRODUK KE DB
      try {
        await prisma.product.create({
          data: {
            name: row.name,
            slug: row.slug ? slugify(String(row.slug)) : slugify(row.name + "-" + Date.now()), 
            description: row.description ? String(row.description) : "",
            
            // Harga cache
            minPrice,
            maxPrice,
            
            pros: row.pros ? String(row.pros) : null,
            cons: row.cons ? String(row.cons) : null,
            
            isFeatured: String(row.isfeatured).toLowerCase() === "true",
            categoryId: categoryId,
            images: imagesList,

            // Nested Create untuk Links
            links: {
                create: linksToCreate
            }
          },
        });
        successCount++;
      } catch (err: any) {
        console.error("❌ Gagal simpan produk:", row.name, err.message);
        errorCount++;
      }
    }

    revalidatePath("/admin/products");
    
    if (successCount === 0) {
      return { success: false, message: `Gagal! 0 data masuk. Pastikan format kolom benar (name, shopee_url, dll).` };
    }

    return { 
      success: true, 
      message: `Sukses import ${successCount} produk. Gagal: ${errorCount}` 
    };

  } catch (error: any) {
    console.error("Critical Error Import:", error);
    return { success: false, message: `Error Sistem: ${error.message}` };
  }
}