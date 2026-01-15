// actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MarketplaceType } from "@prisma/client";

function slugify(text: string) {
  if (!text) return "";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

const marketplaceMap: Record<string, MarketplaceType> = {
  shopee: MarketplaceType.SHOPEE,
  tokped: MarketplaceType.TOKOPEDIA,
  tokopedia: MarketplaceType.TOKOPEDIA,
  tiktok: MarketplaceType.TIKTOK,
  lazada: MarketplaceType.LAZADA,
  whatsapp: MarketplaceType.WHATSAPP_LOKAL,
};

export async function importProducts(rawRows: any[]) {
  try {
    // 1. MAP UNTUK GROUPING (Penyelamat dari duplikasi)
    const productGroups = new Map<string, any>();

    for (const rawRow of rawRows) {
      const row: any = {};
      Object.keys(rawRow).forEach((key) => {
        const cleanKey = key.toLowerCase().trim().replace(/\s+/g, "_");
        row[cleanKey] = rawRow[key];
      });

      if (!row.name) continue;

      const slug = slugify(String(row.name));
      
      // Ambil link dari baris ini (Dynamic Prefix)
      const currentLinks: any[] = [];
      Object.keys(marketplaceMap).forEach((prefix) => {
        const urlKey = `${prefix}_url`;
        if (row[urlKey]) {
          currentLinks.push({
            marketplace: marketplaceMap[prefix],
            storeName: row[`${prefix}_store`] || `${prefix.toUpperCase()} Store`,
            originalUrl: String(row[urlKey]),
            affiliateUrl: row[`${prefix}_affiliate`] || null,
            currentPrice: Number(row[`${prefix}_price`] || 0),
            isStockReady: true,
          });
        }
      });

      // 2. LOGIKA PENGGABUNGAN (Grouping)
      if (productGroups.has(slug)) {
        // Jika slug sudah ada di Map, tambahkan link-nya saja
        const existing = productGroups.get(slug);
        existing.links.push(...currentLinks);
      } else {
        // Jika belum ada, buat entry baru
        productGroups.set(slug, {
          name: String(row.name),
          slug: slug,
          description: row.description || "",
          categoryId: row.category, // Mentah dulu, nanti di-upsert
          images: row.images ? String(row.images).split(",").map(i => i.trim()) : [],
          pros: row.pros || null,
          cons: row.cons || null,
          isFeatured: String(row.isfeatured).toLowerCase() === "true",
          links: currentLinks,
        });
      }
    }

    // 3. EKSEKUSI KE DATABASE (Upsert Pattern)
    let successCount = 0;
    
    for (const productData of productGroups.values()) {
      try {
        // A. Handle Category (Tetap perlu di-upsert per grup)
        let categoryId = null;
        if (productData.categoryId) {
          const cat = await prisma.category.upsert({
            where: { name: String(productData.categoryId).trim() },
            update: {},
            create: { 
              name: String(productData.categoryId).trim(),
              slug: slugify(String(productData.categoryId))
            },
          });
          categoryId = cat.id;
        }

        // B. Hitung Min/Max Price dari semua link yang terkumpul
        const prices = productData.links.map((l: any) => l.currentPrice).filter((p: number) => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

        // C. UPSERT PRODUCT
        // Jika slug sudah ada di DB, kita update. Jika tidak, kita create.
        await prisma.product.upsert({
          where: { slug: productData.slug },
          update: {
            minPrice,
            maxPrice,
            links: {
              // Kita buat link baru. (Hati-hati: ini akan terus menambah link)
              // Jika ingin bersih, bisa pakai deleteMany dulu di sini.
              create: productData.links
            }
          },
          create: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            minPrice,
            maxPrice,
            categoryId,
            images: productData.images,
            pros: productData.pros,
            cons: productData.cons,
            isFeatured: productData.isFeatured,
            links: {
              create: productData.links
            }
          }
        });

        successCount++;
      } catch (err) {
        console.error(`Gagal proses ${productData.slug}:`, err);
      }
    }

    revalidatePath("/admin/products");
    return { success: true, message: `Berhasil memproses ${successCount} produk unik.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}