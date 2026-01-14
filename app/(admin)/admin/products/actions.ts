"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit";
import { MarketplaceType } from "@prisma/client";

async function handleMultipleImageUpload(formData: FormData) {
  const files = formData.getAll("images") as File[]; 
  const existingUrls = formData.getAll("existing_images") as string[];

  const newUrls: string[] = [];
  
  await Promise.all(
    files.map(async (file) => {
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        try {
          // ❌ HAPUS KODE LAMA: 
          // const res = await uploadImage(file);
          // if (res.success) newUrls.push(res.url!);

          // ✅ KODE BARU:
          // uploadImage mengembalikan string URL langsung.
          const url = await uploadImage(file); 
          
          if (url) {
            newUrls.push(url);
          }
        } catch (err) {
          console.error("Gagal upload gambar:", file.name, err);
        }
      }
    })
  );

  return [...existingUrls, ...newUrls];
}

// Schema Validasi Sederhana
const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// ✅ FUNGSI UPDATE PRODUK (REVISED)
export async function updateProduct(
  prevState: any, 
  formData: FormData
) {
  const id = formData.get("id") as string;
  if (!id) return { status: "error", message: "ID Produk hilang." };

  // Validasi field dasar
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("category"), // Perhatikan name field di form
    description: formData.get("description"),
    pros: formData.get("pros"),
    cons: formData.get("cons"),
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { status: "error", message: "Data tidak valid: " + validated.error.issues[0].message };
  }

  try {
    // 1. Handle Gambar
    const finalImages = await handleMultipleImageUpload(formData);

    // 2. ✅ HANDLE LINKS & HARGA (LOGIKA BARU)
    const linksJson = formData.get("linksJSON") as string;
    let linksData: any[] = [];
    
    // Parsing JSON
    if (linksJson) {
      try {
        linksData = JSON.parse(linksJson);
      } catch (e) {
        console.error("JSON Error", e);
      }
    }

    // Hitung Min/Max Price Baru
    let minPrice = 0;
    let maxPrice = 0;

    if (linksData.length > 0) {
      const prices = linksData.map((l: any) => Number(l.currentPrice));
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }

    // 3. Update Database (Transaction / Nested Write)
    // Strategi: Delete semua link lama, buat link baru (cara paling aman untuk sinkronisasi)
    await prisma.product.update({
      where: { id },
      data: {
        name: validated.data.name,
        slug: validated.data.slug,
        description: validated.data.description || "",
        pros: validated.data.pros || "",
        cons: validated.data.cons || "",
        categoryId: validated.data.categoryId || null,
        images: finalImages,
        
        // Update Cache Harga
        minPrice,
        maxPrice,

        // Update Relasi Links
        links: {
          deleteMany: {}, // Hapus link lama
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
      }
    });

    revalidatePath("/admin/products");
    return { status: "success", message: "Produk berhasil diupdate!" };
    
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug sudah digunakan produk lain." };
    }
    return { status: "error", message: error.message || "Gagal update produk." };
  }
}

// ✅ FUNGSI DELETE PRODUK
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