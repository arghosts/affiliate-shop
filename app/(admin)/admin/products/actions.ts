"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit";
import { MarketplaceType } from "@prisma/client";

// --- 1. HELPER UPLOAD IMAGE ---
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
          console.error("Gagal upload gambar:", file.name, err);
        }
      }
    })
  );

  return [...existingUrls, ...newUrls];
}

// --- 2. DEFINISI SCHEMA ZOD (DIPERBAIKI) ---

// Schema Validasi Link Toko
const ProductLinkSchema = z.object({
  marketplace: z.nativeEnum(MarketplaceType, { message: "Tipe Marketplace tidak valid" }).refine((v) => v !== undefined && v !== null, { message: "Marketplace wajib dipilih" }),
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  originalUrl: z.string().url("URL Original harus format URL valid"),
  affiliateUrl: z.string().url("URL Affiliate tidak valid").optional().or(z.literal("")), 
  currentPrice: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  region: z.string().optional().nullable(),
  
  // ✅ UPDATE: Validasi Boolean
  isVerified: z.boolean().default(false),     
  isStockReady: z.boolean().default(true),
});

// Schema Validasi Produk Utama
const ProductSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  description: z.string().optional(),
  categoryId: z.string().uuid("ID Kategori tidak valid").optional().or(z.literal("")),
  pros: z.string().optional(),
  cons: z.string().optional(),
  // Validasi Links sebagai array
  links: z.array(ProductLinkSchema).optional().default([]),
});

// --- 3. FUNGSI CREATE PRODUCT ---
export async function createProduct(prevState: any, formData: FormData) {
  
  // A. Parsing JSON Links
  let parsedLinks = [];
  try {
    const linksJson = formData.get("linksJSON") as string;
    if (linksJson) parsedLinks = JSON.parse(linksJson);
  } catch (e) {
    return { status: "error", message: "Format data Links rusak/tidak valid." };
  }

  // B. Siapkan Data Raw
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug") || undefined, 
    description: formData.get("description"),
    categoryId: formData.get("category"), 
    pros: formData.get("pros"),
    cons: formData.get("cons"),
    links: parsedLinks, 
  };

  // Auto-Slug jika kosong
  if (!rawData.slug && typeof rawData.name === 'string') {
     rawData.slug = rawData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  }

  // C. Validasi Zod
  const validation = ProductSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMessage = validation.error.issues[0].message;
    return { status: "error", message: `Validasi Gagal: ${errorMessage}` };
  }

  const validData = validation.data;

  // D. Hitung Min/Max Price
  let minPrice = 0;
  let maxPrice = 0;
  if (validData.links.length > 0) {
    const prices = validData.links.map((l) => l.currentPrice);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  try {
    const finalImages = await handleMultipleImageUpload(formData);

    await prisma.product.create({
      data: {
        name: validData.name,
        slug: validData.slug,
        description: validData.description || "",
        pros: validData.pros || "",
        cons: validData.cons || "",
        images: finalImages,
        categoryId: validData.categoryId || null,
        minPrice,
        maxPrice,
        links: {
          create: validData.links.map((link) => ({
            marketplace: link.marketplace,
            storeName: link.storeName,
            originalUrl: link.originalUrl,
            affiliateUrl: link.affiliateUrl || null,
            currentPrice: link.currentPrice,
            region: link.region || null,
            isVerified: link.isVerified || false,
            isStockReady: true
          }))
        }
      },
    });

  } catch (error: any) {
    console.error("DB Error:", error);
    if (error.code === 'P2002') return { status: "error", message: "Slug sudah dipakai produk lain." };
    return { status: "error", message: "Gagal menyimpan ke database." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// --- 4. FUNGSI UPDATE PRODUCT (Dengan Bind ID) ---
export async function updateProductWithId(id: string, prevState: any, formData: FormData) {
  
  // A. Parsing JSON Links
  let parsedLinks = [];
  try {
    const linksJson = formData.get("linksJSON") as string;
    if (linksJson) parsedLinks = JSON.parse(linksJson);
  } catch (e) {
    return { status: "error", message: "Format data Links rusak." };
  }

  // B. Siapkan Raw Data
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categoryId: formData.get("category"), 
    pros: formData.get("pros"),
    cons: formData.get("cons"),
    links: parsedLinks, 
  };

  // C. Validasi Zod
  const validation = ProductSchema.safeParse(rawData);
  if (!validation.success) {
    return { status: "error", message: validation.error.issues[0].message };
  }
  const validData = validation.data;

  // D. Hitung Ulang Harga
  let minPrice = 0;
  let maxPrice = 0;
  if (validData.links.length > 0) {
    const prices = validData.links.map((l) => l.currentPrice);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  // Handle Tags Checkbox
  const tagIds: string[] = [];
  Array.from(formData.keys()).forEach((key) => {
    if (key.startsWith("tag_")) tagIds.push(key.replace("tag_", ""));
  });

  try {
    const finalImages = await handleMultipleImageUpload(formData);

    await prisma.product.update({
      where: { id },
      data: {
        name: validData.name,
        slug: validData.slug,
        description: validData.description || "",
        pros: validData.pros || "",
        cons: validData.cons || "",
        categoryId: validData.categoryId || null,
        minPrice,
        maxPrice,
        images: finalImages,

        // Update Tags
        tags: {
          set: [],
          connect: tagIds.map((tid) => ({ id: tid })),
        },

        // Update Links (Hapus Lama -> Buat Baru)
        links: {
                create: validData.links.map((link) => ({
                  marketplace: link.marketplace,
                  storeName: link.storeName,
                  originalUrl: link.originalUrl,
                  affiliateUrl: link.affiliateUrl || null,
                  currentPrice: link.currentPrice,
                  region: link.region || null,
                  
                  // ✅ UPDATE: Ambil value dinamis dari form
                  isVerified: link.isVerified, 
                  isStockReady: link.isStockReady 
                }))
              }
      },
    });

    revalidatePath("/admin/products");

  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === 'P2002') return { status: "error", message: "Slug sudah digunakan." };
    return { status: "error", message: "Gagal update produk." };
  }

  redirect("/admin/products");
}

// --- 5. FUNGSI DELETE PRODUCT ---
export async function deleteProduct(id: string) {
  if (!id) return { status: "error", message: "ID tidak valid" };
  
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { status: "success", message: "Produk berhasil dihapus." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { status: "error", message: "Gagal menghapus produk." };
  }
}