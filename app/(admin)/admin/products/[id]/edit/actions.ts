"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit"; // Pastikan import helper upload ini

// --- HELPER: Handle Upload & Merge ---
async function handleMultipleImageUpload(formData: FormData) {
  // 1. Ambil File Baru
  const files = formData.getAll("images") as File[];
  // 2. Ambil URL Lama yang dipertahankan
  const existingUrls = formData.getAll("existing_images") as string[];

  const newUrls: string[] = [];

  // 3. Upload File Baru ke ImageKit (Paralel)
  await Promise.all(
    files.map(async (file) => {
      // Validasi file
      if (file instanceof File && file.size > 0 && file.type.startsWith("image/")) {
        const url = await uploadImage(file, "/jagopilih/products");
        newUrls.push(url);
      }
    })
  );

  // 4. Gabungkan [Link Lama] + [Link Baru]
  return [...existingUrls, ...newUrls];
}

// --- SCHEMA VALIDASI ---
const productSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  slug: z.string().trim().toLowerCase().min(2),
  price: z.coerce.number().min(0),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  
  // Link optional atau string kosong
  shopeeLink: z.string().trim().optional().or(z.literal("")),
  tokpedLink: z.string().trim().optional().or(z.literal("")),
  
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// --- MAIN FUNCTION: UPDATE PRODUCT ---
export async function updateProduct(id: string, prevState: any, formData: FormData) {
  if (!id) return { status: "error", message: "ID Produk tidak ditemukan" };

  // 1. Parsing Data Form
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    shopeeLink: formData.get("shopeeLink"),
    tokpedLink: formData.get("tokpedLink"),
    pros: formData.get("pros"),
    cons: formData.get("cons"),
  };

  const validated = productSchema.safeParse(rawData);
  if (!validated.success) {
    return { status: "error", message: validated.error.issues[0].message };
  }

  // 2. Handle Tags (Checkbox manual: name="tag_UUID")
  const tagIds: string[] = [];
  Array.from(formData.keys()).forEach((key) => {
    if (key.startsWith("tag_")) {
      const tId = key.replace("tag_", "");
      tagIds.push(tId);
    }
  });

  try {
    // 3. Handle Images (Upload & Merge)
    const finalImages = await handleMultipleImageUpload(formData);

    // 4. Update Database
    await prisma.product.update({
      where: { id },
      data: {
        name: validated.data.name,
        slug: validated.data.slug,
        price: validated.data.price,
        description: validated.data.description || "",
        categoryId: validated.data.categoryId || null,
        
        shopeeLink: validated.data.shopeeLink || null,
        tokpedLink: validated.data.tokpedLink || null,
        
        pros: validated.data.pros || "",
        cons: validated.data.cons || "",

        // 👇 PERBAIKAN: Update Array String langsung
        images: finalImages, 
        
        // Update Tags (Reset & Connect baru)
        tags: {
          set: [], 
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/admin/products");
    
    // Return Success
    return { status: "success", message: "Produk berhasil diupdate" };

  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === 'P2002') {
        return { status: "error", message: "Slug URL sudah dipakai produk lain." };
    }
    return { status: "error", message: error.message || "Gagal update produk." };
  }
}