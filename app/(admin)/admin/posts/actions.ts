"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().trim().min(5, "Judul terlalu pendek").max(150),
  slug: z.string().trim().toLowerCase().min(3),
  // Content kita biarkan agak bebas karena mungkin nanti isi HTML/Markdown
  content: z.string().min(50, "Konten artikel terlalu pendek (min 50 karakter)"), 
  thumbnail: z.string().trim().url().startsWith("https://", "Link gambar harus HTTPS").optional().or(z.literal("")),
});

export async function createPost(prevState: any, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  const { title, slug, content, thumbnail } = result.data;

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        thumbnail: thumbnail || null, // Handle empty string
      },
    });
    revalidatePath("/blog"); 
  } catch (error) {
    return { status: "error", message: "Gagal membuat artikel. Cek Slug unik." };
  }
  redirect("/admin/posts");
}

export async function updatePost(id: string, prevState: any, formData: FormData) {
  // Logic sama, hanya beda prisma.update
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) return { status: "error", message: result.error.issues[0].message };

  const { title, slug, content, thumbnail } = result.data;

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        thumbnail: thumbnail || null,
      },
    });
    revalidatePath("/blog");
  } catch (error) {
    return { status: "error", message: "Gagal update artikel." };
  }
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    return { status: "success", message: "Artikel dihapus" };
  } catch (error) {
    return { status: "error", message: "Gagal menghapus artikel" };
  }
}