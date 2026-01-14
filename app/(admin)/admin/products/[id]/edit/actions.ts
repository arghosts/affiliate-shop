"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "@/lib/imagekit";
import { MarketplaceType } from "@prisma/client";

// --- HELPER: Handle Multiple Upload ---
async function handleMultipleImageUpload(formData: FormData) {
  const files = formData.getAll("images") as File[];
  const existingUrls = formData.getAll("existing_images") as string[];
  const newUrls: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        try {
          const url = await uploadImage(file);
          if (url) newUrls.push(url);
        } catch (err) {
          console.error("Gagal upload:", err);
        }
      }
    })
  );

  return [...existingUrls, ...newUrls];
}

// --- FUNGSI UPDATE UTAMA (Dengan ID dari Bind) ---
export async function updateProductWithId(id: string, prevState: any, formData: FormData) {
  
  // 1. Ambil Data Dasar Form
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("category") as string;
  const slug = formData.get("slug") as string;
  const pros = formData.get("pros") as string;
  const cons = formData.get("cons") as string;

  // 2. Handle Tags (Checkbox)
  const tagIds: string[] = [];
  Array.from(formData.keys()).forEach((key) => {
    if (key.startsWith("tag_")) {
      tagIds.push(key.replace("tag_", ""));
    }
  });

  // 3. Handle Images
  const finalImages = await handleMultipleImageUpload(formData);

  // 4. ✅ HANDLE LINKS & AFFILIATE URL
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
    // 6. UPDATE DATABASE
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || "",
        pros: pros || "",
        cons: cons || "",
        categoryId: categoryId || null,
        
        // Update Cache Harga
        minPrice,
        maxPrice,

        // Update Images
        images: finalImages,

        // Update Tags (Putus lama, sambung baru)
        tags: {
          set: [], 
          connect: tagIds.map((tid) => ({ id: tid })), 
        },

        // ✅ UPDATE LINKS (Hapus Semua -> Buat Baru)
        links: {
          deleteMany: {}, // Reset link lama
          create: linksData.map((link) => ({
            marketplace: link.marketplace as MarketplaceType,
            storeName: link.storeName,
            originalUrl: link.originalUrl,
            
            // 👇 DISINI KITA SIMPAN AFFILIATE URL
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

// --- FUNGSI DELETE (Tetap Diperlukan) ---
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { status: "success", message: "Produk dihapus." };
  } catch (error) {
    return { status: "error", message: "Gagal menghapus produk." };
  }
}