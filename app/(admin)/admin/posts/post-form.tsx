"use client";

import { useActionState, useState } from "react";
import { Loader2, Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface PostData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
}

interface PostFormProps {
  action: any;
  initialData?: PostData | null; // Null = Create Mode
}

const initialState = { status: "", message: "" };

export default function PostForm({ action, initialData }: PostFormProps) {
  const actionWithId = initialData?.id ? action.bind(null, initialData.id) : action;
  const [state, formAction, isPending] = useActionState(actionWithId, initialState);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");

  // Auto-Slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) { // Hanya auto-slug saat create baru
      setSlug(val.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }
  };

  if (state.status === "error") {
    toast.error(state.message, { id: "error-toast" });
  }

  return (
    <form action={formAction} className="max-w-4xl mx-auto space-y-8">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/admin/posts" className="text-sm font-bold text-gray-400 hover:text-coffee flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke List
        </Link>
        <h1 className="text-2xl font-black text-coffee">{initialData ? "Edit Artikel" : "Tulis Artikel Baru"}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: EDITOR UTAMA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="space-y-4">
               <div>
                 <label className="label-admin">Judul Artikel</label>
                 <input 
                    name="title" 
                    value={title} 
                    onChange={handleTitleChange} 
                    className="input-admin text-lg font-bold" 
                    placeholder="Contoh: 5 Drone Terbaik 2024"
                    required 
                 />
               </div>
               <div>
                 <label className="label-admin">Slug (URL)</label>
                 <input 
                    name="slug" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    className="input-admin bg-gray-50 text-sm font-mono text-gray-500"
                    required 
                 />
               </div>
               <div>
                 <label className="label-admin">Isi Konten</label>
                 {/* Tips: Nanti bisa diganti Rich Text Editor, sekarang Textarea dulu */}
                 <textarea 
                    name="content" 
                    defaultValue={initialData?.content || ""}
                    className="input-admin min-h-[400px] leading-relaxed" 
                    placeholder="Tulis review lengkap di sini..."
                    required
                 />
                 <p className="text-xs text-gray-400 mt-2 text-right">Bisa menggunakan HTML sederhana.</p>
               </div>
             </div>
          </div>
        </div>

        {/* KOLOM KANAN: META & GAMBAR */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-bold text-coffee mb-4 border-b pb-2">Thumbnail</h3>
              
              <div className="aspect-video w-full bg-gray-100 rounded-lg border border-gray-200 mb-4 overflow-hidden relative flex items-center justify-center">
                 {thumbnail ? (
                    <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                 )}
              </div>

              <div className="space-y-2">
                <label className="label-admin">URL Gambar</label>
                <input 
                  name="thumbnail" 
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..." 
                  className="input-admin" 
                />
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-gold-accent text-white py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <><Save className="w-4 h-4" /> Simpan Artikel</>}
                </button>
              </div>
           </div>
        </div>

      </div>
    </form>
  );
}