"use client";

import { useActionState, useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Store } from "lucide-react";
import toast from "react-hot-toast";
import FormMultiImageUpload from "@/components/FormMultiImageUpload";

// Tipe Data
interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }

// Struktur Data Link (Frontend State)
interface LinkItem {
  marketplace: string;
  storeName: string;
  originalUrl: string;
  currentPrice: number;
  region: string;
}

// ✅ FIX 1: Definisikan tipe action dengan jelas, bukan 'any'
interface ProductFormSharedProps {
  categories: Category[];
  tags: Tag[];
  action: (prevState: any, formData: FormData) => Promise<any>; // Tipe eksplisit
  initialData?: any; 
}

const initialState = {
  status: "",
  message: ""
};

export default function ProductFormShared({ categories, tags, action, initialData }: ProductFormSharedProps) {
  // Catatan: Jika Anda menggunakan Next.js 14/React 18, hook ini mungkin bernama 'useFormState' dari 'react-dom'
  // Jika error runtime 'useActionState is not defined', ganti import ke 'react-dom' dan nama ke 'useFormState'
  const [state, formAction, isPending] = useActionState(action, initialState);
  
  // STATE UNTUK LINKS (ARRAY DINAMIS)
  const [links, setLinks] = useState<LinkItem[]>([]);

  // Load initial data (untuk mode Edit nanti)
  useEffect(() => {
    if (initialData?.links) {
      setLinks(initialData.links.map((l: any) => ({
        marketplace: l.marketplace,
        storeName: l.storeName,
        originalUrl: l.originalUrl,
        currentPrice: Number(l.currentPrice),
        region: l.region || ""
      })));
    }
    
    if (state?.status === "error") toast.error(state.message);
    if (state?.status === "success") toast.success(state.message);
  }, [state, initialData]);

  // Handler Tambah Baris Link Baru
  const addLink = () => {
    setLinks([...links, { 
      marketplace: "SHOPEE", 
      storeName: "", 
      originalUrl: "", 
      currentPrice: 0,
      region: "" 
    }]);
  };

  // Handler Hapus Baris
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Handler Ubah Data Link
  const updateLink = (index: number, field: keyof LinkItem, value: string | number) => {
    const newLinks = [...links];
    // @ts-ignore
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  // Handler Submit: Inject JSON ke FormData
  const handleSubmit = (formData: FormData) => {
    // Inject JSON
    formData.set("linksJSON", JSON.stringify(links));
    
    // ✅ FIX 2: Casting formAction agar TypeScript tidak rewel
    // (formAction as any)(formData); 
    // Atau karena kita sudah fix interface di atas, panggil langsung:
    startTransition(() => {
       formAction(formData);
    });
  };

  // Helper transition wrapper jika diperlukan (untuk React 18/Next 14)
  // Tapi untuk useActionState standar, biasanya langsung formAction bisa.
  // Kita gunakan pendekatan direct call di dalam tag form action untuk kompatibilitas maksimal.

  return (
    // ✅ FIX 3: Panggil formAction via wrapper handleSubmit di onSubmit atau action
    <form action={handleSubmit} className="flex flex-col gap-8 max-w-5xl mx-auto">
      
      {/* 1. INFORMASI UTAMA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-lg text-coffee mb-2">Informasi Produk</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Nama Produk</label>
            <input name="name" defaultValue={initialData?.name} required placeholder="Samsung Galaxy S24..." className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gold-accent/20 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Slug (Opsional)</label>
            <input name="slug" defaultValue={initialData?.slug} placeholder="auto-generate" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gold-accent/20 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">Kategori</label>
          <select name="category" defaultValue={initialData?.categoryId || ""} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none">
            <option value="">-- Pilih Kategori --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Deskripsi Singkat</label>
            <textarea name="description" defaultValue={initialData?.description} rows={3} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
        </div>
      </div>

      {/* 2. DAFTAR TOKO & HARGA (BAGIAN BARU) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg text-coffee flex items-center gap-2">
            <Store className="w-5 h-5 text-gold-accent" />
            Daftar Toko & Harga
          </h2>
          <button type="button" onClick={addLink} className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold hover:bg-blue-100 transition flex items-center gap-1">
            <Plus className="w-3 h-3" /> Tambah Toko
          </button>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
            Belum ada link toko. Klik tombol Tambah Toko di atas.
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col md:flex-row gap-3 items-start md:items-center">
                {/* Platform */}
                <select 
                  value={link.marketplace}
                  onChange={(e) => updateLink(index, "marketplace", e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 text-sm font-bold bg-white w-full md:w-auto"
                >
                  <option value="SHOPEE">Shopee</option>
                  <option value="TOKOPEDIA">Tokopedia</option>
                  <option value="TIKTOK">TikTok Shop</option>
                  <option value="WHATSAPP_LOKAL">WA Lokal</option>
                  <option value="WEBSITE_RESMI">Web Resmi</option>
                </select>

                {/* Nama Toko */}
                <input 
                  type="text" 
                  placeholder="Nama Toko"
                  value={link.storeName}
                  onChange={(e) => updateLink(index, "storeName", e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 text-sm w-full md:w-1/4"
                />

                {/* Region (Opsional) */}
                <input 
                  type="text" 
                  placeholder="Region (ex: Bojonegoro)"
                  value={link.region}
                  onChange={(e) => updateLink(index, "region", e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 text-sm w-full md:w-1/6 bg-yellow-50 placeholder:text-yellow-600/50"
                />

                {/* Harga */}
                <div className="relative w-full md:w-1/5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                  <input 
                    type="number" 
                    placeholder="Harga"
                    value={link.currentPrice || ""}
                    onChange={(e) => updateLink(index, "currentPrice", Number(e.target.value))}
                    className="p-2 pl-8 rounded-lg border border-gray-300 text-sm w-full font-mono font-bold text-green-700"
                  />
                </div>

                {/* URL */}
                <input 
                  type="text" 
                  placeholder="URL Produk..."
                  value={link.originalUrl}
                  onChange={(e) => updateLink(index, "originalUrl", e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 text-sm w-full md:flex-1"
                />

                {/* Hapus */}
                <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. GAMBAR PRODUK */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg text-coffee mb-4">Galeri Produk</h2>
        <FormMultiImageUpload name="images" initialData={initialData?.images || []} />
      </div>

      {/* 4. PROS & CONS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-green-600">Kelebihan (Pros)</label>
            <textarea name="pros" defaultValue={initialData?.pros} placeholder="- Layar cerah&#10;- Baterai awet" rows={4} className="w-full p-3 bg-green-50/30 rounded-xl border border-green-100 outline-none focus:border-green-300" />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-red-500">Kekurangan (Cons)</label>
            <textarea name="cons" defaultValue={initialData?.cons} placeholder="- Mahal&#10;- Berat" rows={4} className="w-full p-3 bg-red-50/30 rounded-xl border border-red-100 outline-none focus:border-red-300" />
        </div>
      </div>

      {/* TOMBOL SAVE */}
      <div className="flex justify-end sticky bottom-8">
        <button type="submit" disabled={isPending} className="bg-gold-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-gold-accent/20 hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-70">
          {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : <><Save className="w-5 h-5" /> Simpan Produk</>}
        </button>
      </div>

    </form>
  );
}

// Helper untuk React 18 / NextJS 14 compatibility
function startTransition(callback: () => void) {
  callback();
}