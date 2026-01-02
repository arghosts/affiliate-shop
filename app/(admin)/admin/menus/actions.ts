"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const menuSchema = z.object({
  label: z.string().trim().min(2, "Label terlalu pendek").max(20),
  url: z.string().trim().min(1, "URL wajib diisi"),
});

export async function createMenu(formData: FormData) {
  const rawData = {
    label: formData.get("label"),
    url: formData.get("url"),
  };

  const result = menuSchema.safeParse(rawData);
  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  try {
    // Cari order tertinggi saat ini
    const lastItem = await prisma.navbarLink.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = (lastItem?.order ?? 0) + 1;

    await prisma.navbarLink.create({
      data: {
        label: result.data.label,
        url: result.data.url,
        order: newOrder,
      },
    });

    revalidatePath("/"); // Refresh Navbar Public
    revalidatePath("/admin/menus"); // Refresh Admin List
    return { status: "success", message: "Menu berhasil ditambahkan" };
  } catch (error) {
    return { status: "error", message: "Gagal menambah menu" };
  }
}

export async function deleteMenu(id: string) {
  try {
    await prisma.navbarLink.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/menus");
    return { status: "success", message: "Menu dihapus" };
  } catch (error) {
    return { status: "error", message: "Gagal menghapus menu" };
  }
}

// Logic untuk menukar urutan (Naik/Turun)
export async function moveMenu(id: string, direction: "up" | "down") {
  try {
    const currentItem = await prisma.navbarLink.findUnique({ where: { id } });
    if (!currentItem) return { status: "error", message: "Item tidak ditemukan" };

    // Cari item tetangga yang mau ditukar posisinya
    const neighbor = await prisma.navbarLink.findFirst({
      where: {
        order: direction === "up" 
          ? { lt: currentItem.order } // Cari yang ordernya LEBIH KECIL (di atasnya)
          : { gt: currentItem.order }, // Cari yang ordernya LEBIH BESAR (di bawahnya)
      },
      orderBy: {
        order: direction === "up" ? 'desc' : 'asc', // Ambil yang paling dekat
      },
    });

    if (!neighbor) return { status: "error", message: "Sudah di posisi mentok" };

    // SWAP (Tukar) Order menggunakan Transaction
    await prisma.$transaction([
      prisma.navbarLink.update({
        where: { id: currentItem.id },
        data: { order: neighbor.order },
      }),
      prisma.navbarLink.update({
        where: { id: neighbor.id },
        data: { order: currentItem.order },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/admin/menus");
    return { status: "success", message: "Urutan diperbarui" };

  } catch (error) {
    return { status: "error", message: "Gagal mengubah urutan" };
  }
}