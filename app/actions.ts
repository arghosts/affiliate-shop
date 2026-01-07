'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { imagekit } from "@/lib/imagekit";

// Fungsi bantu untuk membuat slug dari nama produk

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// 1. Tambahkan parameter 'prevState' di urutan pertama
export async function createProduct(prevState: any, formData: FormData) {

  const name = formData.get('name') as string;
  const price = formData.get('price');
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const shopeeLink = formData.get('shopeeLink') as string;
  const pros = formData.get('pros') as string;
  const cons = formData.get('cons') as string;
  
  let slug = formData.get('slug') as string;
  if (!slug) slug = slugify(name);

  const rawImages = formData.getAll('images') as string[];
  const validImages = rawImages.filter(url => url.trim() !== '');

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        categoryId: category,
        description,
        price: Number(price),
        shopeeLink,
        pros,
        cons,
        images: {
          create: validImages.map(url => ({ url }))
        }
      }
    });

    // PENTING: Refresh halaman Home di background agar data baru muncul nanti
    revalidatePath('/');
    
    // KEMBALIKAN STATUS SUKSES (Jangan redirect)
    return { 
      success: true, 
      message: `✅ Produk "${name}" berhasil disimpan! Silakan input lagi.` 
    };

  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      message: '❌ Gagal menyimpan. Cek apakah Slug sudah ada atau koneksi bermasalah.' 
    };
  }
}

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // 1. Cek ke Database
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  // 2. Validasi Password
  if (!admin || admin.password !== password) {
    return { message: 'Username atau Password Salah!' };
  }

  // 3. Buat Session (Cookie) - Ini intinya!
  // Kita simpan cookie bernama "admin_session"
  (await cookies()).set('admin_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // Login valid selama 7 hari
    path: '/',
  });

  redirect('/admin'); // Lempar ke dashboard admin
}

export async function logout() {
  (await cookies()).delete('admin_session');
  redirect('/login');
}

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file found");
  }

  // Convert file to Buffer (ImageKit needs this)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const response = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/jagopilih/products", // Keep it organized
    });

    // Return the URL so you can save it to your Database later
    return { success: true, url: response.url };
    
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, error: "Upload failed" };
  }
}