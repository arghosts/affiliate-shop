"use client";

import { useActionState, useState } from "react";
import { Save, Loader2, Image as ImageIcon, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Interface Props
interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }

// Tipe data untuk Initial Data (saat Edit)
interface ProductData {
  id?: string;
  name: string;
  slug: string;
  price: number;
  categoryId: string | null;
  description?: string | null;
  shopeeLink?: string | null;
  tokpedLink?: string | null;
  pros?: string | null;
  cons?: string | null;
  images: { url: string }[]; // Relasi gambar
  tags: { id: string }[];    // Relasi tag
}

// 1. ✅ DEFINISIKAN TIPE STATE RETURN DARI SERVER
interface ActionState {
  status: string;
  message: string;
}

interface ProductFormSharedProps {
  categories: Category[];
  tags: Tag[];
  action: any; 
  initialData?: ProductData | null;
}

// 2. ✅ UPDATE NILAI AWAL USEACTIONSTATE
const initialState: ActionState = {
  status: "",
  message: ""
};

export default function ProductFormShared({ categories, tags, action, initialData }: ProductFormSharedProps) {
  // Bind ID jika sedang edit agar dikirim ke Server Action
  const actionWithId = initialData?.id ? action.bind(null, initialData.id) : action;
  
  const [state, formAction, isPending] = useActionState(actionWithId, initialState);
  
  // ✅ Initialize State dengan Initial Data (jika ada)
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  
  // Map images object ke array string, atau default 1 slot kosong
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images && initialData.images.length > 0 
      ? initialData.images.map(img => img.url) 
      : [""]
  );

  // Auto-Slug (Hanya jalan jika user mengetik nama, dan slug masih kosong atau sama dengan nama lama)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Auto slug hanya jika create baru, saat edit user biasanya tidak ingin slug berubah otomatis
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }
  };

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
      
      {/* --- INFO UTAMA --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4">Informasi Dasar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="label-admin">Nama Produk</label>
            <input name="name" value={name} onChange={handleNameChange} className="input-admin" required />
          </div>
          <div className="space-y-2">
            <label className="label-admin">Slug (URL)</label>
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="input-admin bg-gray-50" required />
          </div>
          <div className="space-y-2">
            <label className="label-admin">Harga (IDR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
              <input 
                name="price" 
                type="number" 
                defaultValue={initialData?.price ? Number(initialData.price) : ""} 
                className="input-admin pl-10" 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-admin">Kategori</label>
            <select name="categoryId" defaultValue={initialData?.categoryId || ""} className="input-admin appearance-none" required>
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 space-y-2">
           <label className="label-admin">Deskripsi Singkat</label>
           <textarea name="description" defaultValue={initialData?.description || ""} className="input-admin h-24" />
        </div>
      </div>

      {/* --- MULTIPLE IMAGE SECTION --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h3 className="text-lg font-bold text-coffee flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gold-accent" /> Galeri Gambar ({imageUrls.length}/6)
          </h3>
          <button type="button" onClick={addImageField} className="text-xs font-bold bg-gray-100 hover:bg-gold-accent hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" /> Tambah URL
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                {url ? <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/file.svg")} /> : <ImageIcon className="w-6 h-6 text-gray-300" />}
              </div>
              <div className="flex-1 flex gap-2">
                <input 
                  name="images" 
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="input-admin"
                  placeholder="URL Gambar..."
                  required={index === 0}
                />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => removeImageField(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- LINKS & PROS/CONS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4 flex items-center gap-2">
             <LinkIcon className="w-5 h-5 text-gold-accent" /> Affiliate Links
           </h3>
           <div className="space-y-4">
             <div>
               <label className="label-admin">Link Shopee</label>
               <input name="shopeeLink" defaultValue={initialData?.shopeeLink || ""} className="input-admin" />
             </div>
             <div>
               <label className="label-admin">Link Tokopedia</label>
               <input name="tokpedLink" defaultValue={initialData?.tokpedLink || ""} className="input-admin" />
             </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4">Pros & Cons</h3>
           <div className="space-y-4">
             <div>
               <label className="label-admin">Kelebihan</label>
               <textarea name="pros" defaultValue={initialData?.pros || ""} className="input-admin h-20" />
             </div>
             <div>
               <label className="label-admin">Kekurangan</label>
               <textarea name="cons" defaultValue={initialData?.cons || ""} className="input-admin h-20" />
             </div>
           </div>
        </div>
      </div>

      {/* --- TAGS (Pre-checked Logic) --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <h3 className="text-lg font-bold text-coffee mb-6 border-b pb-4">Tags / Label</h3>
         <div className="flex flex-wrap gap-4">
           {tags.map((tag) => {
             // Cek apakah tag ini ada di initialData
             const isChecked = initialData?.tags.some((t) => t.id === tag.id);
             return (
                <label key={tag.id} className="cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    name={`tag_${tag.id}`} 
                    className="peer sr-only" 
                    defaultChecked={isChecked} // ✅ Logic Centang Otomatis
                  />
                  <div className="px-4 py-2 rounded-full border border-gray-200 text-sm font-bold text-gray-500 peer-checked:bg-gold-accent peer-checked:text-white peer-checked:border-gold-accent transition-all hover:bg-gray-50">
                    #{tag.name}
                  </div>
                </label>
             );
           })}
         </div>
      </div>

      <div className="flex justify-end sticky bottom-8">
        <button type="submit" disabled={isPending} className="bg-gold-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-gold-accent/20 hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-70">
          {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : <><Save className="w-5 h-5" /> {initialData ? "Update Produk" : "Simpan Produk"}</>}
        </button>
      </div>
    </form>
  );
}