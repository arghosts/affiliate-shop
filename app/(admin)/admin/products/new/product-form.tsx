"use client";

import { useActionState, useState } from "react";
import { createProductAction } from "./actions";
import { Save, Loader2, Image as ImageIcon, Link as LinkIcon, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }

interface ProductFormProps {
  categories: Category[];
  tags: Tag[];
}

export default function ProductForm({ categories, tags }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(createProductAction, null);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  
  // ✅ STATE BARU: Array URL Gambar (Default 1 slot kosong)
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  // Auto-Slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
  };

  // ✅ LOGIC TAMBAH/HAPUS URL GAMBAR
  const addImageField = () => {
    if (imageUrls.length >= 6) return toast.error("Maksimal 6 gambar.");
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageField = (index: number) => {
    const newImages = [...imageUrls];
    newImages.splice(index, 1);
    setImageUrls(newImages);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newImages = [...imageUrls];
    newImages[index] = value;
    setImageUrls(newImages);
  };

  if (state?.status === "error") {
    toast.error(state.message, { id: "error-toast" });
  }

  return (
    <form action={formAction} className="space-y-8 max-w-5xl mx-auto">
      
      {/* --- INFO UTAMA (Sama seperti sebelumnya) --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4">Informasi Dasar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="label-admin">Nama Produk</label>
            <input name="name" value={name} onChange={handleNameChange} placeholder="Contoh: DJI Osmo Action 4" className="input-admin" required />
          </div>
          <div className="space-y-2">
            <label className="label-admin">Slug (URL)</label>
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="input-admin bg-gray-50" required />
          </div>
          <div className="space-y-2">
            <label className="label-admin">Harga (IDR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
              <input name="price" type="number" placeholder="5000000" className="input-admin pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-admin">Kategori</label>
            <select name="categoryId" className="input-admin appearance-none" required>
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 space-y-2">
           <label className="label-admin">Deskripsi Singkat</label>
           <textarea name="description" className="input-admin h-24" placeholder="Deskripsi untuk SEO..." />
        </div>
      </div>

      {/* --- ✅ MULTIPLE IMAGE SECTION --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h3 className="text-lg font-bold text-coffee flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gold-accent" /> Galeri Gambar ({imageUrls.length}/6)
          </h3>
          <button 
            type="button" 
            onClick={addImageField}
            className="text-xs font-bold bg-gray-100 hover:bg-gold-accent hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Tambah URL
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-4 items-start animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Preview Kecil */}
              <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                {url ? (
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/file.svg")} />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>

              {/* Input URL */}
              <div className="flex-1 space-y-1">
                <div className="flex gap-2">
                  <input 
                    name="images" // PENTING: Semua input namanya sama "images" agar bisa ditangkap formData.getAll()
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder={index === 0 ? "URL Gambar Utama (Wajib)" : "URL Gambar Tambahan (Opsional)"}
                    className="input-admin"
                    required={index === 0} // Hanya gambar pertama yang wajib
                  />
                  {/* Tombol Hapus (Kecuali gambar pertama) */}
                  {imageUrls.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeImageField(index)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Hapus baris ini"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">*Gambar pertama akan menjadi Thumbnail utama.</p>
      </div>

      {/* --- AFFILIATE & PROS/CONS (Sama seperti sebelumnya) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4 flex items-center gap-2">
             <LinkIcon className="w-5 h-5 text-gold-accent" /> Affiliate Links
           </h3>
           <div className="space-y-4">
             <div>
               <label className="label-admin">Link Shopee</label>
               <input name="shopeeLink" placeholder="https://shope.ee/..." className="input-admin" />
             </div>
             <div>
               <label className="label-admin">Link Tokopedia</label>
               <input name="tokpedLink" placeholder="https://tokopedia.link/..." className="input-admin" />
             </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4">Pros & Cons</h3>
           <div className="space-y-4">
             <div>
               <label className="label-admin">Kelebihan (Pisahkan dengan koma)</label>
               <textarea name="pros" placeholder="Murah, Ringan, Baterai Awet" className="input-admin h-20" />
             </div>
             <div>
               <label className="label-admin">Kekurangan (Pisahkan dengan koma)</label>
               <textarea name="cons" placeholder="Tidak tahan air, Charging lama" className="input-admin h-20" />
             </div>
           </div>
        </div>
      </div>

      {/* --- TAGS --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4">Tags / Label</h3>
         <div className="flex flex-wrap gap-4">
           {tags.map((tag) => (
             <label key={tag.id} className="cursor-pointer select-none">
               <input type="checkbox" name={`tag_${tag.id}`} className="peer sr-only" />
               <div className="px-4 py-2 rounded-full border border-gray-200 text-sm font-bold text-gray-500 peer-checked:bg-gold-accent peer-checked:text-white peer-checked:border-gold-accent transition-all hover:bg-gray-50">
                 #{tag.name}
               </div>
             </label>
           ))}
         </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end sticky bottom-8">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-gold-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-gold-accent/20 hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Simpan Produk
            </>
          )}
        </button>
      </div>
    </form>
  );
}