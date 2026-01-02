"use client";

import { useState } from "react";
import { createMenu, deleteMenu, moveMenu } from "./actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Link as LinkIcon, Menu } from "lucide-react";
import toast from "react-hot-toast";

interface MenuLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export default function MenuManager({ initialMenus }: { initialMenus: MenuLink[] }) {
  const [isPending, setIsPending] = useState(false);

  // Handle Add
  async function handleAdd(formData: FormData) {
    setIsPending(true);
    const result = await createMenu(formData);
    if (result.status === "success") {
      toast.success(result.message);
      (document.getElementById("menuForm") as HTMLFormElement).reset();
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  }

  // Handle Delete
  async function handleDelete(id: string) {
    if (!confirm("Hapus menu ini?")) return;
    const result = await deleteMenu(id);
    if (result.status === "success") toast.success(result.message);
    else toast.error(result.message);
  }

  // Handle Move
  async function handleMove(id: string, direction: "up" | "down") {
    const result = await moveMenu(id, direction);
    if (result.status === "error") toast.error(result.message);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* --- FORM TAMBAH (KIRI) --- */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-lg font-bold text-coffee mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-gold-accent" /> Tambah Menu
          </h3>
          <form id="menuForm" action={handleAdd} className="space-y-4">
            <div>
              <label className="label-admin">Label Menu</label>
              <input name="label" placeholder="Contoh: Blog" className="input-admin" required />
            </div>
            <div>
              <label className="label-admin">URL / Link</label>
              <input name="url" placeholder="Contoh: /blog atau https://..." className="input-admin" required />
            </div>
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-coffee text-white py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Menu"}
            </button>
          </form>
        </div>
      </div>

      {/* --- LIST MENU (KANAN) --- */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
             <Menu className="w-5 h-5 text-coffee" />
             <h3 className="font-bold text-coffee">Struktur Navbar ({initialMenus.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {initialMenus.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Belum ada menu.</div>
            ) : (
                initialMenus.map((menu, index) => (
                    <div key={menu.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group animate-in fade-in slide-in-from-bottom-2">
                        
                        {/* Info Menu */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-300 w-6 text-center">#{index + 1}</span>
                            <div>
                                <p className="font-bold text-coffee text-sm">{menu.label}</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                   <LinkIcon className="w-3 h-3" /> {menu.url}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Tombol Naik (Hidden jika paling atas) */}
                            <button 
                                onClick={() => handleMove(menu.id, "up")}
                                disabled={index === 0}
                                className="p-2 text-gray-400 hover:text-coffee hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-all"
                                title="Geser Naik"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>

                            {/* Tombol Turun (Hidden jika paling bawah) */}
                            <button 
                                onClick={() => handleMove(menu.id, "down")}
                                disabled={index === initialMenus.length - 1}
                                className="p-2 text-gray-400 hover:text-coffee hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-all"
                                title="Geser Turun"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            
                            <div className="w-px h-4 bg-gray-200 mx-1"></div>

                            <button 
                                onClick={() => handleDelete(menu.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Menu"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}