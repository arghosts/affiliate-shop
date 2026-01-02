"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- SKEMA VALIDASI SAMA PERSIS DENGAN CREATE ---
const productSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Nama produk wajib diisi")
    .max(150)
    .regex(/^[a-zA-Z0-9\s\-_.,()]+$/, "Nama mengandung karakter tidak valid"),
    
  slug: z.string().trim().toLowerCase().min(3),
  price: z.coerce.number().min(1000),
  categoryId: z.string().min(1),
  description: z.string().trim().optional(),
  
  images: z.array(z.string().url().startsWith("https://", "Link gambar harus HTTPS")).min(1, "Minimal 1 gambar"),
  
  shopeeLink: z.string().trim().optional().refine(val => !val || val.startsWith("https://"), "Link harus HTTPS"),
  tokpedLink: z.string().trim().optional().refine(val => !val || val.startsWith("https://"), "Link harus HTTPS"),
    
  pros: z.string().trim().optional(),
  cons: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});

export async function updateProductAction(id: string, prevState: any, formData: FormData) {
  const tagIds: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("tag_") && value === "on") tagIds.push(key.replace("tag_", ""));
  }

  const imageLinks = formData.getAll("images")
    .map(i => i.toString())
    .filter(u => u.trim() !== "");

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    images: imageLinks,
    shopeeLink: formData.get("shopeeLink"),
    tokpedLink: formData.get("tokpedLink"),
    pros: formData.get("pros"),
    cons: formData.get("cons"),
    tags: tagIds,
  };

  const result = productSchema.safeParse(rawData);
  if (!result.success) return { status: "error", message: result.error.issues[0].message };

  const validated = result.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus Gambar Lama
      await tx.productImage.deleteMany({ where: { productId: id } });

      // 2. Update Data
      await tx.product.update({
        where: { id },
        data: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description,
          price: validated.price,
          categoryId: validated.categoryId,
          shopeeLink: validated.shopeeLink || null,
          tokpedLink: validated.tokpedLink || null,
          pros: validated.pros,
          cons: validated.cons,
          
          images: {
            create: validated.images.map(url => ({ url }))
          },
          
          tags: {
            set: [],
            connect: validated.tags?.map(tId => ({ id: tId }))
          }
        }
      });
    });

    revalidatePath("/admin/products");
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Gagal update produk." };
  }

  redirect("/admin/products");
}