"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadImage } from "@/lib/imagekit";

// Helper Slugify
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Schema Validasi
const postSchema = z.object({
  title: z.string().trim().min(5, "Judul terlalu pendek").max(150),
  slug: z.string().trim().toLowerCase().optional().or(z.literal("")),
  content: z.string().min(2, "Konten tidak boleh kosong"),
  // Thumbnail any karena bisa File atau String url
  thumbnail: z.any().optional(),
  referenceLink: z.string().optional().or(z.literal("")),
});

// --- HELPER LOGIC UPLOAD DI ACTION ---
async function handleThumbnailUpload(formData: FormData) {
  const file = formData.get("thumbnail") as File;
  const existingUrl = formData.get("thumbnail_existing") as string;

  // 1. Jika ada file baru yang valid (size > 0)
  if (file && file.size > 0) {
    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      throw new Error("File harus berupa gambar.");
    }
    // Upload ke ImageKit (Folder blog)
    // Pastikan lib/imagekit.ts sudah diupdate menerima folder
    return await uploadImage(file, "/jagopilih/blog");
  }

  // 2. Jika tidak ada file baru, kembalikan URL lama
  return existingUrl || null;
}

// --- CREATE POST ---
export async function createPost(id: string | null, prevState: any, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    referenceLink: formData.get("referenceLink"),
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  const validated = postSchema.safeParse(rawData);
  if (!validated.success) return { status: "error", message: validated.error.issues[0].message };

  const { title, slug, content, thumbnail } = result.data;

  // 1. PROSES GAMBAR
  let finalThumbnailUrl = null;
  try {
     finalThumbnailUrl = await handleThumbnailUpload(formData);
  } catch (e: any) {
     return { status: "error", message: e.message };
  }

  // 2. PARSING JSON
  let contentJson;
  try {
    contentJson = JSON.parse(content);
  } catch (e) {
    return { status: "error", message: "Format konten rusak (Invalid JSON)." };
  }

  const finalSlug = slug && slug.length > 0 ? slug : slugify(title);

  try {
    await prisma.post.create({
      data: {
        title: validated.data.title,
        slug: finalSlug,
        content: contentJson,
        thumbnail: finalThumbnailUrl, // hasil upload
        
        // ✅ SIMPAN LINK KE PRODUK DI SINI
        referenceLink: validated.data.referenceLink || null,
      },
    });
    revalidatePath("/blog");
  } catch (error) {
    return { status: "error", message: "Gagal membuat artikel. Slug mungkin duplikat." };
  }
  
  return { status: "success", message: "Artikel berhasil dibuat" };
}

// --- UPDATE POST ---
export async function updatePost(id: string | null, prevState: any, formData: FormData) {
  if (!id) return { status: "error", message: "ID artikel tidak ditemukan" };

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    referenceLink: formData.get("referenceLink"),
  };
  
  const result = postSchema.safeParse(rawData);
  if (!result.success) return { status: "error", message: result.error.issues[0].message };

  const { title, slug, content, thumbnail } = result.data;

  // 1. PROSES GAMBAR
  let finalThumbnailUrl = null;
  try {
     finalThumbnailUrl = await handleThumbnailUpload(formData);
  } catch (e: any) {
     return { status: "error", message: e.message };
  }

  // 2. PARSING JSON
  let contentJson;
  try {
    contentJson = JSON.parse(content);
  } catch (e) {
    return { status: "error", message: "Format konten rusak (Invalid JSON)." };
  }

  const finalSlug = slug && slug.length > 0 ? slug : slugify(title);

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title: result.data.title,
        slug: finalSlug,
        content: contentJson,
        thumbnail: finalThumbnailUrl, // hasil upload
        
        // ✅ SIMPAN LINK KE PRODUK DI SINI
        referenceLink: result.data.referenceLink || null,
      },
    });
    revalidatePath("/blog");
  } catch (error) {
    console.error("Update Error:", error);
    return { status: "error", message: "Gagal update artikel." };
  }
  
  return { status: "success", message: "Artikel berhasil diubah" };
}

// --- DELETE POST ---
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