"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteNote } from "./actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // 👈 Tambah ini

export default function DeleteButton({ noteId }: { noteId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter(); // 👈 Hook router

  const handleDelete = async () => {
    // 1. Konfirmasi User
    const confirmed = window.confirm("Yakin ingin menghapus catatan ini?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // 2. Panggil Server Action
      const result = await deleteNote(noteId);

      if (result.status === "success") {
        toast.success(result.message);
        router.refresh(); // 👈 Refresh UI server component
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
      title="Hapus Catatan"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}