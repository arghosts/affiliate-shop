"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  if (!text) return "";
  return text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}

export async function importProducts(rawRows: any[]) {
  try {
    let successCount = 0;
    let errorCount = 0;

    // Cek di terminal Vercel/VS Code untuk melihat data yang masuk
    console.log("🔍 Data baris pertama yang diterima:", rawRows[0]);

    for (const rawRow of rawRows) {
      // 1. NORMALISASI KEYS (Bikin kode pintar baca Name/name/NAME)
      const row: any = {};
      Object.keys(rawRow).forEach((key) => {
        // Ubah semua header jadi huruf kecil & hapus spasi
        row[key.toLowerCase().trim()] = rawRow[key];
      });

      // 2. Validasi (Sekarang lebih aman karena keys sudah dinormalisasi)
      if (!row.name || !row.price) {
        // Skip baris kosong tapi jangan hitung error jika memang baris total kosong
        console.log("⚠️ Skip baris karena name/price kosong:", row);
        errorCount++;
        continue;
      }

      // 3. Handle Kategori
      let categoryId = null;
      if (row.categoryid || row.category) { // Bisa baca 'categoryId' atau 'Category'
        const catName = row.categoryid || row.category;
        
        const existingCat = await prisma.category.findFirst({
          where: { name: { equals: catName, mode: "insensitive" } },
        });

        if (existingCat) {
          categoryId = existingCat.id;
        } else {
          const newCat = await prisma.category.create({
            data: {
              name: catName,
              slug: slugify(catName),
            },
          });
          categoryId = newCat.id;
        }
      }

      // 4. LOGIC BARU: Kumpulkan Gambar (Multi-Image Support)
      const imagesToCreate = [];

      // Cek kolom image1 s/d image6 di Excel
      const potentialImages = [
        row.image1, row.image2, row.image3, 
        row.image4, row.image5, row.image6
      ];

      potentialImages.forEach((imgUrl) => {
        if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim().length > 0) {
          imagesToCreate.push({ url: imgUrl.trim() });
        }
      });

      // Jika di Excel KOSONG SEMUA, baru pakai Placeholder
      if (imagesToCreate.length === 0) {
        imagesToCreate.push({ 
          url: "https://placehold.co/600x400?text=" + encodeURIComponent(row.name) 
        });
      }

      // 5. Simpan Produk dengan Array Gambar
      await prisma.product.create({
        data: {
          name: row.name,
          slug: row.slug ? slugify(String(row.slug)) : slugify(row.name),
          description: row.description ? String(row.description) : "",
          price: Number(row.price),
          shopeeLink: row.shopeelink || null,
          tokpedLink: row.tokpedlink || null,
          pros: row.pros || null,
          cons: row.cons || null,
          isFeatured: String(row.isfeatured).toLowerCase() === "true",
          categoryId: categoryId,
          
          // 👇 BAGIAN AJAIBNYA DISINI
          images: {
             create: imagesToCreate // Masukkan array gambar (bisa 1, bisa 6)
          }
        },
      });

      successCount++;
    }

    revalidatePath("/admin/products");
    
    // Beri laporan detail
    if (successCount === 0) {
      return { success: false, message: `Gagal! 0 data masuk. Cek Terminal VSCode untuk detail error.` };
    }
    
    return { success: true, message: `Sukses! ${successCount} produk masuk. (${errorCount} di-skip)` };
  
  } catch (error) {
    console.error("Import Critical Error:", error);
    return { success: false, message: "Server Error. Cek Terminal." };
  }
}