"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  id: z.coerce.number(), // Pastikan ID jadi number
  
  // Identity
  siteName: z.string().trim().min(2).max(50).regex(/^[a-zA-Z0-9\s\-_.]+$/, "Nama site mengandung karakter ilegal"),
  footerAbout: z.string().trim().max(300, "Footer terlalu panjang"),
  
  // Hero Image (Boleh kosong, tapi kalau isi harus HTTPS)
  heroImage: z.string().trim().url().startsWith("https://").optional().or(z.literal("")), 

  // Hero Content
  heroTitle: z.string().trim().min(5).max(100),
  heroPromo: z.string().trim().max(50),
  heroDescription: z.string().trim().max(500),
  
  // Buttons
  primaryBtnText: z.string().trim().max(30),
  primaryBtnLink: z.string().trim(), // Boleh link internal (/about) atau external (#products)
  secondaryBtnText: z.string().trim().max(30),
  secondaryBtnLink: z.string().trim(),
});

export async function updateSettings(prevState: any, formData: FormData) {
  try {
    // 1. Siapkan Raw Data
    const rawData = {
      id: formData.get("id"),
      siteName: formData.get("siteName"),
      footerAbout: formData.get("footerAbout"),
      heroImage: formData.get("heroImage"),
      heroTitle: formData.get("heroTitle"),
      heroPromo: formData.get("heroPromo"),
      heroDescription: formData.get("heroDescription"),
      primaryBtnText: formData.get("primaryBtnText"),
      primaryBtnLink: formData.get("primaryBtnLink"),
      secondaryBtnText: formData.get("secondaryBtnText"),
      secondaryBtnLink: formData.get("secondaryBtnLink"),
    };

    // 2. Validasi Zod
    const result = settingsSchema.safeParse(rawData);

    if (!result.success) {
      return { status: "error", message: result.error.issues[0].message };
    }

    const val = result.data;

    // 3. Update Database
    // Note: heroImage jika string kosong (""), kita ubah jadi null agar database bersih
    await prisma.siteSetting.update({
      where: { id: val.id },
      data: {
        siteName: val.siteName,
        footerAbout: val.footerAbout,
        heroImage: val.heroImage === "" ? null : val.heroImage, // Handle empty string -> null
        heroTitle: val.heroTitle,
        heroPromo: val.heroPromo,
        heroDescription: val.heroDescription,
        primaryBtnText: val.primaryBtnText,
        primaryBtnLink: val.primaryBtnLink,
        secondaryBtnText: val.secondaryBtnText,
        secondaryBtnLink: val.secondaryBtnLink,
      },
    });

    revalidatePath("/"); // Refresh halaman depan
    
    return { status: "success", message: "Pengaturan website berhasil disimpan!" };

  } catch (error) {
    console.error("Settings Error:", error);
    return { status: "error", message: "Gagal menyimpan pengaturan." };
  }
}