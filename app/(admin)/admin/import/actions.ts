"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper simpel untuk bikin slug kategori jika kategori baru dibuat otomatis
function slugify(text: string) {
  return text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}

export async function importProducts(rows: any[]) {
  try {
    let successCount = 0;
    let errorCount = 0;

    for (const row of rows) {
      // 1. Validasi minimal
      if (!row.name || !row.price) {
        errorCount++;
        continue; // Skip baris kosong/rusak
      }

      // 2. LOGIKA PENTING: Handle Kategori
      // Di Excel isinya "Camera" (Nama), tapi DB butuh ID.
      let categoryId = null;

      if (row.categoryId) {
        // Cari dulu apakah kategori "Camera" sudah ada?
        const existingCat = await prisma.category.findFirst({
          where: { name: { equals: row.categoryId, mode: "insensitive" } },
        });

        if (existingCat) {
          categoryId = existingCat.id;
        } else {
          // Jika belum ada, BUAT BARU otomatis!
          const newCat = await prisma.category.create({
            data: {
              name: row.categoryId,
              slug: slugify(row.categoryId),
            },
          });
          categoryId = newCat.id;
        }
      }

      // 3. Simpan Produk
      await prisma.product.create({
        data: {
          name: row.name,
          slug: row.slug || slugify(row.name), // Pakai slug excel atau generate
          description: row.description || "",
          price: Number(row.price), // Pastikan jadi angka
          shopeeLink: row.shopeeLink || null,
          tokpedLink: row.tokpedLink || null, // Sesuai nama kolom di Excel Anda
          pros: row.pros || null,
          cons: row.cons || null,
          // Convert string "True"/"False" excel jadi boolean
          isFeatured: String(row.isFeatured).toLowerCase() === "true",
          categoryId: categoryId,
          // Default image placeholder jika excel tidak punya kolom gambar
          images: {
             create: { url: "https://placehold.co/600x400?text=No+Image" } 
          }
        },
      });

      successCount++;
    }

    revalidatePath("/admin/products");
    return { success: true, message: `Berhasil import ${successCount} produk!` };
  
  } catch (error) {
    console.error("Import Error:", error);
    return { success: false, message: "Gagal import data. Cek console server." };
  }
}