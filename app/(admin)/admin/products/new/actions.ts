"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit";
import { MarketplaceType } from "@prisma/client";

// --- HELPER: Handle Multiple Upload (FIXED) ---
async function handleMultipleImageUpload(formData: FormData) {
  const files = formData.getAll("images") as File[];
  const existingUrls = formData.getAll("existing_images") as string[];
  const newUrls: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      // Validasi file: Harus File object, ada isinya, dan tipe gambar
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        try {
          // ✅ FIX: uploadImage mengembalikan string URL langsung
          const url = await uploadImage(file);
          if (url) newUrls.push(url);
        } catch (err) {
          console.error("Gagal upload gambar:", file.name, err);
        }
      }
    })
  );

  return [...existingUrls, ...newUrls];
}

// --- FUNGSI CREATE PRODUCT ---
export async function createProduct(prevState: any, formData: FormData) {
  // 1. Ambil Field Dasar
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const pros = formData.get("pros") as string;
  const cons = formData.get("cons") as string;
  const categoryId = formData.get("category") as string; // perhatikan name di form
  
  // Handle Slug
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  }

  // 2. Handle Images
  const finalImages = await handleMultipleImageUpload(formData);

  // 3. ✅ HANDLE LINKS (JSON PARSING)
  const linksJson = formData.get("linksJSON") as string;
  let linksData: any[] = [];
  
  if (linksJson) {
    try {
      linksData = JSON.parse(linksJson);
    } catch (e) {
      console.error("JSON Error:", e);
      return { status: "error", message: "Format link toko tidak valid." };
    }
  }

  // 4. Hitung Min/Max Price Otomatis
  let minPrice = 0;
  let maxPrice = 0;

  if (linksData.length > 0) {
    const prices = linksData.map((l: any) => Number(l.currentPrice));
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  try {
    // 5. Simpan ke Database (Nested Write)
    await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        pros: pros || "",
        cons: cons || "",
        images: finalImages,
        categoryId: categoryId || null,
        
        // Field Baru
        minPrice,
        maxPrice,

        // Relasi ke ProductLink
        links: {
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

  } catch (error: any) {
    console.error("Database Error:", error);
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug/Nama produk sudah ada." };
    }
    return { status: "error", message: "Gagal menyimpan produk." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}