"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validasi Ketat untuk Tag
const tagSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Nama tag minimal 2 karakter")
    .max(30, "Nama tag maksimal 30 karakter")
    // Regex: Hanya Huruf, Angka, Spasi, dan Strip (-)
    .regex(/^[a-zA-Z0-9\s-]+$/, "Tag hanya boleh berisi huruf, angka, dan spasi."),
});

export async function createTag(formData: FormData) {
  const rawName = formData.get("name");

  // 1. Validasi Zod
  const result = tagSchema.safeParse({ name: rawName });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  const name = result.data.name;

  // 2. Auto-generate slug (Bersih)
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  try {
    // Cek duplikasi manual (biar pesan errornya enak dibaca)
    const existing = await prisma.tag.findFirst({ where: { slug } });
    if (existing) {
      return { status: "error", message: "Tag dengan nama ini sudah ada." };
    }

    await prisma.tag.create({
      data: { name, slug }
    });
    
    revalidatePath("/admin/tags");
    revalidatePath("/admin/products/new"); // Refresh form produk
    revalidatePath("/admin/products/[id]/edit"); // Refresh form edit produk
    
    return { status: "success", message: "Tag berhasil ditambahkan" };
    
  } catch (error) {
    console.error("Tag Error:", error);
    return { status: "error", message: "Terjadi kesalahan server." };
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({ where: { id } });
    revalidatePath("/admin/tags");
    revalidatePath("/admin/products/new");
    return { status: "success", message: "Tag dihapus" };
  } catch (error) {
    return { status: "error", message: "Gagal menghapus tag" };
  }
}