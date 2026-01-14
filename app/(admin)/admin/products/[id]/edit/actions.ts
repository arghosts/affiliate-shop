"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "@/lib/imagekit";
import { MarketplaceType } from "@prisma/client";

// --- HELPER: Handle Multiple Upload (Versi FIX String URL) ---
async function handleMultipleImageUpload(formData: FormData) {
  const files = formData.getAll("images") as File[];
  const existingUrls = formData.getAll("existing_images") as string[];
  const newUrls: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        try {
          const url = await uploadImage(file); // Mengembalikan string URL
          if (url) newUrls.push(url);
        } catch (err) {
          console.error("Gagal upload:", err);
        }
      }
    })
  );

  return [...existingUrls, ...newUrls];
}

// --- MAIN UPDATE FUNCTION ---
export async function updateProduct(prevState: any, formData: FormData) {
  const id = formData.get("id") as string; // Hidden input ID (biasanya otomatis ada jika form library support, atau kita ambil dari param kalau perlu. Tapi di shared form biasa tidak ada input hidden ID, jadi kita ambil dari URL params atau bind. 
  // ⚠️ KOREKSI: Shared Form kita tidak punya input hidden name="id". 
  // Cara terbaik di Next.js Server Action adalah menggunakan .bind(null, id) di page.tsx,
  // TAPI karena struktur form kita shared, mari kita cari ID dari slug lama atau asumsikan ID dikirim via bind.
  // ATAU: Kita ambil ID dari url di page sebelumnya? Tidak bisa di action.
  
  // SOLUSI PRAKTIS: 
  // Kita harus pastikan ID terkirim. Karena saya tidak mengubah product-form-shared untuk kirim ID,
  // Mari kita cek apakah formData mengirim ID? Biasanya tidak kecuali kita input hidden.
  
  // SEMENTARA: Kita ambil ID dari path revalidation atau bind. 
  // TAPI TUNGGU: Di file edit/page.tsx, kita memanggil `action={updateProduct}`.
  // Kita harus ubah sedikit page.tsx di atas atau pakai trik bind.
  
  // Mari kita pakai cara paling aman: Ambil ID dari formData (Asumsi kita inject hidden input ID di form shared atau pakai bind).
  // Karena form shared dipakai create juga, kita tidak bisa inject ID sembarangan.
  
  // UPDATE STRATEGI:
  // Kita akan gunakan `updateProduct.bind(null, product.id)` di page.tsx nanti.
  // Jadi argumen pertama fungsi ini adalah `id`, argumen kedua `prevState`, ketiga `formData`.
}

// ---------------------------------------------------------
// REVISI TOTAL AGAR KOMPATIBEL DENGAN BIND ID
// ---------------------------------------------------------

export async function updateProductWithId(id: string, prevState: any, formData: FormData) {
  
  // 1. Ambil Data Dasar
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("category") as string;
  const slug = formData.get("slug") as string;
  const pros = formData.get("pros") as string;
  const cons = formData.get("cons") as string;

  // 2. Handle Tags (Ambil checkbox yang dicentang)
  const tagIds: string[] = [];
  Array.from(formData.keys()).forEach((key) => {
    if (key.startsWith("tag_")) {
      tagIds.push(key.replace("tag_", ""));
    }
  });

  // 3. Handle Images
  const finalImages = await handleMultipleImageUpload(formData);

  // 4. ✅ HANDLE LINKS (JSON Parsing)
  const linksJson = formData.get("linksJSON") as string;
  let linksData: any[] = [];
  
  if (linksJson) {
    try {
      linksData = JSON.parse(linksJson);
    } catch (e) {
      console.error("JSON Error", e);
    }
  }

  // 5. Hitung Min/Max Price Baru
  let minPrice = 0;
  let maxPrice = 0;

  if (linksData.length > 0) {
    const prices = linksData.map((l: any) => Number(l.currentPrice));
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  try {
    // 6. UPDATE DATABASE (TRANSACTION LIKE)
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || "",
        pros: pros || "",
        cons: cons || "",
        categoryId: categoryId || null,
        
        // Cache Harga
        minPrice,
        maxPrice,

        // Update Images
        images: finalImages,

        // Update Tags (Reset & Re-connect)
        tags: {
          set: [], // Putuskan semua hubungan tag lama
          connect: tagIds.map((tid) => ({ id: tid })), // Sambung tag baru
        },

        // ✅ UPDATE LINKS (STRATEGI: DELETE ALL -> CREATE NEW)
        // Ini cara paling aman untuk sinkronisasi data relasi one-to-many di form edit
        links: {
          deleteMany: {}, // Hapus semua link lama milik produk ini
          create: linksData.map((link) => ({
            marketplace: link.marketplace as MarketplaceType,
            storeName: link.storeName,
            originalUrl: link.originalUrl,
            affiliateUrl: link.affiliateUrl || null,
            currentPrice: Number(link.currentPrice),
            region: link.region || null,
            isVerified: link.isVerified || false,
            isStockReady: true
          }))
        }
      },
    });

    revalidatePath("/admin/products");
    
  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug sudah digunakan." };
    }
    return { status: "error", message: "Gagal mengupdate produk." };
  }

  // Redirect sukses
  redirect("/admin/products");
}