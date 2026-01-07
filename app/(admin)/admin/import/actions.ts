"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    // Debugging
    if (rawRows.length > 0) {
      console.log("🔍 Sample Row Data:", rawRows[0]);
    }

    for (const rawRow of rawRows) {
      // 1. NORMALISASI KEYS (Lowercase & Trim)
      const row: any = {};
      Object.keys(rawRow).forEach((key) => {
        row[key.toLowerCase().trim()] = rawRow[key];
      });

      // 2. VALIDASI DASAR
      if (!row.name || !row.price) {
        console.log("⚠️ Skip baris karena name/price kosong:", row);
        errorCount++;
        continue;
      }

      // 3. HANDLE KATEGORI
      let categoryId = null;
      if (row.category) {
        const catSlug = slugify(String(row.category));
        const existingCat = await prisma.category.findUnique({
          where: { slug: catSlug },
        });

        if (existingCat) {
          categoryId = existingCat.id;
        } else {
          const newCat = await prisma.category.create({
            data: {
              name: String(row.category),
              slug: catSlug,
            },
          });
          categoryId = newCat.id;
        }
      }

      // 4. HANDLE GAMBAR (Versi Array String [])
      // Kita cari kolom image1, image2, dst di Excel
      const imagesList: string[] = [];

      for (let i = 1; i <= 6; i++) {
        const imgKey = `image${i}`; // image1, image2...
        if (row[imgKey]) {
          imagesList.push(String(row[imgKey]).trim());
        }
      }

      // Jika kosong, kasih placeholder
      if (imagesList.length === 0) {
        imagesList.push(
          "https://placehold.co/600x400?text=" + encodeURIComponent(row.name)
        );
      }

      // 5. BERSIHKAN HARGA
      const cleanPrice = String(row.price).replace(/[^0-9.]/g, "");

      // 6. SIMPAN PRODUK
      try {
        await prisma.product.create({
          data: {
            name: row.name,
            // Fallback slug biar unik pakai timestamp
            slug: row.slug ? slugify(String(row.slug)) : slugify(row.name + "-" + Date.now()), 
            description: row.description ? String(row.description) : "",
            price: Number(cleanPrice),
            
            shopeeLink: row.shopeelink || null,
            tokpedLink: row.tokpedlink || null,
            
            pros: row.pros || null,
            cons: row.cons || null,
            
            // Boolean check
            isFeatured: String(row.isfeatured).toLowerCase() === "true",
            
            categoryId: categoryId,

            // 👇 PERBAIKAN UTAMA: Langsung Array String
            images: imagesList, 
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
      return { success: false, message: `Gagal! 0 data masuk. Cek terminal.` };
    }

    return { 
      success: true, 
      message: `Sukses import ${successCount} produk. Gagal: ${errorCount}` 
    };

  } catch (error) {
    console.error("Import Critical Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat import." };
  }
}