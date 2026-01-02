"use client";

import { useState } from "react";
import { createTag, deleteTag } from "./actions";
import { Plus, Trash2, Tag as TagIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface TagData {
  id: string;
  name: string;
  _count: { products: number }; // Hitung berapa produk yg pakai tag ini
}

export default function TagManager({ initialTags }: { initialTags: TagData[] }) {
  const [isPending, setIsPending] = useState(false);

  // Handle Tambah Tag
  async function handleAdd(formData: FormData) {
    setIsPending(true);
    const result = await createTag(formData);
    
    if (result.status === "success") {
      toast.success(result.message);
      // Reset form manual
      (document.getElementById("tagForm") as HTMLFormElement).reset();
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  }

  // Handle Hapus Tag
  async function handleDelete(id: string, count: number) {
    if (count > 0) {
      const confirm = window.confirm(`Tag ini dipakai di ${count} produk. Yakin hapus? Label akan hilang dari produk tersebut.`);
      if (!confirm) return;
    } else {
        if(!window.confirm("Hapus tag ini?")) return;
    }

    const result = await deleteTag(id);
    if (result.status === "success") toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* --- FORM TAMBAH (KIRI) --- */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-lg font-bold text-coffee mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-gold-accent" /> Tambah Baru
          </h3>
          <form id="tagForm" action={handleAdd} className="space-y-4">
            <div>
              <label className="label-admin">Nama Tag</label>
              <input 
                name="name" 
                placeholder="Contoh: Gaming, Budget..." 
                className="input-admin"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-gold-accent text-white py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Tag"}
            </button>
          </form>
        </div>
      </div>

      {/* --- LIST TAGS (KANAN) --- */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="font-bold text-coffee">Daftar Tag Tersedia ({initialTags.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {initialTags.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Belum ada tag.</div>
            ) : (
                initialTags.map((tag) => (
                    <div key={tag.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gold-accent/10 rounded-lg">
                                <TagIcon className="w-4 h-4 text-gold-accent" />
                            </div>
                            <div>
                                <p className="font-bold text-coffee text-sm">{tag.name}</p>
                                <p className="text-[10px] text-gray-400">Digunakan di {tag._count.products} produk</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(tag.id, tag._count.products)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Tag"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}