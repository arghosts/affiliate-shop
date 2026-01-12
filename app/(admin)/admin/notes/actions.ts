"use server";

// Menggunakan relative path agar lebih kompatibel dengan WSL/Roo Code
import { prisma } from "../../../../lib/prisma"; 
import { revalidatePath } from "next/cache";

// --- GET NOTES ---
export async function getNotes() {
  try {
    return await prisma.adminNote.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Get Notes Error:", error);
    return []; // Return array kosong lebih aman daripada throw error di Server Component
  }
}

// --- CREATE NOTE ---
export async function createNote(prevState: any, formData: FormData) {
  const content = formData.get("content") as string;
  const title = (formData.get("title") as string) || "Catatan Admin";

  if (!content || content.trim().length < 3) {
    return { status: "error", message: "Catatan terlalu pendek (min. 3 karakter)" };
  }

  try {
    await prisma.adminNote.create({
      data: {
        title: title,
        content: content,
      },
    });

    // Revalidate path yang spesifik sesuai struktur folder Anda
    revalidatePath("/admin/notes");
    return { status: "success", message: "Catatan berhasil disimpan" };
  } catch (error) {
    console.error("Create Note Error:", error);
    return { status: "error", message: "Gagal menyimpan ke database" };
  }
}

// --- DELETE NOTE ---
export async function deleteNote(id: string) {
  try {
    await prisma.adminNote.delete({
      where: { id },
    });
    revalidatePath("/admin/notes");
    return { status: "success", message: "Catatan berhasil dihapus" };
  } catch (error) {
    console.error("Delete Note Error:", error);
    return { status: "error", message: "Gagal menghapus data" };
  }
}