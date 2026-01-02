"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  try {
    // Prisma akan otomatis menghapus ProductImage dan relation Tags karena relasi Cascade (jika diset)
    // Tapi untuk aman, kita delete row product-nya saja, relasi foreign key biasanya akan mengikuti atau perlu disetup.
    // Di schema kita: ProductImage punya onDelete: Cascade. Jadi aman.
    
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products"); // Refresh halaman list
    return { status: "success", message: "Produk berhasil dihapus" };
    
  } catch (error) {
    console.error("Delete Error:", error);
    return { status: "error", message: "Gagal menghapus produk" };
  }
}