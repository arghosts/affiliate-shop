"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit"; // Pastikan helper ini ada

// --- HELPER: Handle Multiple Upload ---
async function handleMultipleImageUpload(formData: FormData) {
  // 1. Ambil File Baru
  const files = formData.getAll("images") as File[];
  
  // 2. Ambil URL Lama (jika ada, biasanya untuk edit, tapi create jarang pakai ini)
  const existingUrls = formData.getAll("existing_images") as string[];

  const newUrls: string[] = [];

  // 3. Upload File Baru ke ImageKit (Paralel)
  await Promise.all(
    files.map(async (file) => {
      // Validasi file: Harus File object, ada isinya, dan tipe gambar
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        const url = await uploadImage(file, "/jagopilih/products");
        newUrls.push(url);
      }
    })
  );

  // 4. Gabungkan
  return [...existingUrls, ...newUrls];
}

// --- SKEMA VALIDASI ---
const productSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Nama produk wajib diisi")
    .max(150, "Nama produk terlalu panjang")
    .regex(/^[a-zA-Z0-9\s\-_.,()]+$/, "Nama mengandung karakter tidak valid"),
    
  slug: z.string().trim().toLowerCase().min(3),
  
  price: z.coerce.number().min(1000, "Harga tidak valid"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().trim().optional(),
  
  // Validasi Array Gambar (Array of Strings)
  images: z.array(z.string().url().startsWith("https://", "Link gambar harus HTTPS")).min(1, "Minimal 1 gambar"),
  
  shopeeLink: z.string().trim().optional()
    .refine(val => !val || val.startsWith("https://"), "Link Shopee harus HTTPS"),
    
  tokpedLink: z.string().trim().optional()
    .refine(val => !val || val.startsWith("https://"), "Link Tokopedia harus HTTPS"),
    
  pros: z.string().trim().optional(),
  cons: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});

// --- ACTION: CREATE PRODUCT ---
export async function createProduct(id: string | null, prevState: any, formData: FormData) {
  
  // 1. Proses Upload Gambar Dulu
  let imageLinks: string[] = [];
  try {
     imageLinks = await handleMultipleImageUpload(formData);
  } catch (e) {
     return { status: "error", message: "Gagal upload gambar ke cloud." };
  }

  // 2. Handle Tags (Manual parsing dari checkbox name="tag_UUID")
  const tagIds: string[] = [];
  Array.from(formData.keys()).forEach((key) => {
    if (key.startsWith("tag_")) {
      tagIds.push(key.replace("tag_", ""));
    }
  });

  // 3. Susun Raw Data untuk Validasi
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    images: imageLinks, // Array URL hasil upload
    shopeeLink: formData.get("shopeeLink"),
    tokpedLink: formData.get("tokpedLink"),
    pros: formData.get("pros"),
    cons: formData.get("cons"),
    tags: tagIds,
  };

  const result = productSchema.safeParse(rawData);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues[0].message,
    };
  }

  const validated = result.data;

  try {
    // 4. Simpan ke Database
    await prisma.product.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description || "",
        price: validated.price,
        categoryId: validated.categoryId,
        shopeeLink: validated.shopeeLink || null,
        tokpedLink: validated.tokpedLink || null,
        pros: validated.pros || "",
        cons: validated.cons || "",
        
        // 👇 PERBAIKAN UTAMA: Langsung simpan array string
        images: validated.images, 
        
        // Relasi Tags
        tags: {
          connect: validated.tags?.map((id) => ({ id }))
        }
      },
    });

    revalidatePath("/admin/products");
    
  } catch (error: any) {
    console.error("Create Error:", error);
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug URL sudah digunakan produk lain." };
    }
    return { status: "error", message: "Gagal menyimpan produk." };
  }

  // Redirect wajib di luar try-catch
  redirect("/admin/products");
}