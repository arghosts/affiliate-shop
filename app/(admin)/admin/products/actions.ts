"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit";

// Helper Multi Upload
async function handleMultipleImageUpload(formData: FormData) {
  const files = formData.getAll("images") as File[]; // File Baru dari input multiple
  const existingUrls = formData.getAll("existing_images") as string[]; // Link Lama yang dipertahankan

  const newUrls: string[] = [];
  
  // Upload paralel ke ImageKit
  await Promise.all(
    files.map(async (file) => {
      // Pastikan file valid (bukan empty object)
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        const url = await uploadImage(file, "/jagopilih/products");
        newUrls.push(url);
      }
    })
  );

  // Gabungkan URL lama + URL baru
  return [...existingUrls, ...newUrls];
}

const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().min(2, "Slug wajib diisi (auto generate)"),
  price: z.coerce.number().min(0, "Harga tidak boleh minus"),
  categoryId: z.string().optional(),
  shopeeLink: z.string().trim().optional().or(z.literal("")),
  tokpedLink: z.string().trim().optional().or(z.literal("")),
  description: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// --- CREATE PRODUCT ---
export async function createProduct(id: string | null, prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const validated = productSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { status: "error", message: validated.error.issues[0].message };
  }
  
  try {
    // 1. Proses Gambar (Multiple)
    const finalImages = await handleMultipleImageUpload(formData);

    // 2. Simpan ke DB
    await prisma.product.create({
      data: {
        name: validated.data.name,
        slug: validated.data.slug,
        price: validated.data.price,
        description: validated.data.description || "",
        shopeeLink: validated.data.shopeeLink || "",
        tokpedLink: validated.data.tokpedLink || "",
        pros: validated.data.pros || "",
        cons: validated.data.cons || "",
        categoryId: validated.data.categoryId || null,
        images: finalImages, // ✅ Simpan Array String
      }
    });

    revalidatePath("/admin/products");
    return { status: "success", message: "Produk berhasil dibuat!" };
    
  } catch (error: any) {
    // Handle error unique slug
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug sudah digunakan produk lain." };
    }
    return { status: "error", message: error.message || "Gagal membuat produk." };
  }
}

// --- UPDATE PRODUCT ---
export async function updateProduct(id: string | null, prevState: any, formData: FormData) {
  if (!id) return { status: "error", message: "ID tidak ditemukan" };
  
  const rawData = Object.fromEntries(formData);
  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { status: "error", message: validated.error.issues[0].message };
  }

  try {
    // 1. Proses Gambar (Multiple)
    const finalImages = await handleMultipleImageUpload(formData);

    // 2. Update DB
    await prisma.product.update({
      where: { id },
      data: {
        name: validated.data.name,
        slug: validated.data.slug,
        price: validated.data.price,
        description: validated.data.description || "",
        shopeeLink: validated.data.shopeeLink || "",
        tokpedLink: validated.data.tokpedLink || "",
        pros: validated.data.pros || "",
        cons: validated.data.cons || "",
        categoryId: validated.data.categoryId || null,
        images: finalImages, // ✅ Timpa dengan array baru (hasil gabungan lama + baru)
      }
    });

    revalidatePath("/admin/products");
    return { status: "success", message: "Produk berhasil diupdate!" };
    
  } catch (error: any) {
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug sudah digunakan produk lain." };
    }
    return { status: "error", message: error.message || "Gagal update produk." };
  }
}

// --- DELETE PRODUCT (INI YANG TADI HILANG) ---
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { status: "success", message: "Produk berhasil dihapus" };
  } catch (error) {
    return { status: "error", message: "Gagal menghapus produk" };
  }
}