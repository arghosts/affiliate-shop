"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProduct } from "./actions"; // ✅ Pastikan import dari file sebelah
import toast from "react-hot-toast";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Konfirmasi sederhana
    const confirmed = window.confirm("Yakin ingin menghapus produk ini? Semua data harga dan link akan ikut terhapus.");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteProduct(productId);
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
      title="Hapus Produk"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}