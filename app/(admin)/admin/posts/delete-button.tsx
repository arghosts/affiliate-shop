"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deletePost } from "./actions"; // Import Server Action
import toast from "react-hot-toast";

export default function DeleteButton({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    // Mencegah event bubbling (agar tidak memicu klik pada parent elemen jika ada)
    e.preventDefault();

    // 1. Konfirmasi User
    const confirmed = window.confirm("Yakin ingin menghapus artikel ini? Tindakan ini permanen.");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // 2. Panggil Server Action
      const result = await deletePost(postId);

      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus Artikel"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}