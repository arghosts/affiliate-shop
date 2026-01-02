"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProduct } from "./actions"; // Import action yang tadi
import toast from "react-hot-toast";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Konfirmasi User (Browser Native Confirm cukup untuk MVP)
    const confirmed = window.confirm("Yakin ingin menghapus produk ini? Tindakan tidak bisa dibatalkan.");
    if (!confirmed) return;

    setIsDeleting(true);

    // 2. Panggil Server Action
    const result = await deleteProduct(productId);

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    setIsDeleting(false);
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