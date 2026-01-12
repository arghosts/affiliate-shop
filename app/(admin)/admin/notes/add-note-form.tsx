"use client";

import { useState } from "react";
import { createNote } from "./actions";
import { Plus, Loader2, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddNoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Handle Submit Manual (Agar lebih fleksibel daripada useFormState untuk UI sederhana)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      // Panggil Server Action
      // Parameter pertama 'undefined' karena action kita expect prevState (untuk useFormState), 
      // tapi kita panggil langsung.
      const result = await createNote(undefined, formData);

      if (result.status === "success") {
        toast.success(result.message);
        (e.target as HTMLFormElement).reset(); // Reset form
        router.refresh(); // Refresh list di bawah
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal menyimpan catatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-coffee/10 shadow-sm mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gold-accent/10 rounded-full text-gold-accent">
            <StickyNote className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-coffee">Buat Catatan Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            name="title"
            type="text"
            placeholder="Judul Catatan (Opsional)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none transition-all font-bold text-coffee placeholder:font-normal"
          />
        </div>
        <div>
          <textarea
            name="content"
            required
            rows={3}
            placeholder="Tulis isi catatan di sini..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none transition-all text-gray-600 resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-coffee text-white px-6 py-2.5 rounded-xl font-bold hover:bg-coffee/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-coffee/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Simpan Catatan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}