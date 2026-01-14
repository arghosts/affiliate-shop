"use client";

import { useActionState, useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Store, Link as LinkIcon, DollarSign, BadgeCheck, Box } from "lucide-react";
import toast from "react-hot-toast";
import FormMultiImageUpload from "@/components/FormMultiImageUpload";

interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }

// Interface UI
interface LinkItem {
  marketplace: string;
  storeName: string;
  originalUrl: string;
  affiliateUrl: string;
  currentPrice: number;
  region: string;
  isVerified: boolean;   // Baru
  isStockReady: boolean; // Baru
}

interface ProductFormSharedProps {
  categories: Category[];
  tags: Tag[];
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: any; 
}

const initialState = { status: "", message: "" };

export default function ProductFormShared({ categories, tags, action, initialData }: ProductFormSharedProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    if (initialData?.links) {
      setLinks(initialData.links.map((l: any) => ({
        marketplace: l.marketplace,
        storeName: l.storeName,
        originalUrl: l.originalUrl,
        affiliateUrl: l.affiliateUrl || "",
        currentPrice: Number(l.currentPrice),
        region: l.region || "",
        isVerified: l.isVerified ?? false,     // Load value
        isStockReady: l.isStockReady ?? true,  // Load value
      })));
    }
    
    // Toast Feedback
    if (state?.status === "error") toast.error(state.message);
    if (state?.status === "success") toast.success(state.message);
  }, [state, initialData]);

  // ✅ UPDATE ADD LINK (Default value)
  const addLink = () => {
    setLinks([...links, { 
      marketplace: "SHOPEE", 
      storeName: "", 
      originalUrl: "", 
      affiliateUrl: "", 
      currentPrice: 0,
      region: "",
      isVerified: false,
      isStockReady: true 
    }]);
  };

  const updateLink = (index: number, field: keyof LinkItem, value: LinkItem[keyof LinkItem]) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value } as LinkItem;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = (formData: FormData) => {
    // Inject JSON sebelum kirim
    formData.set("linksJSON", JSON.stringify(links));
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-8 max-w-5xl mx-auto">
      
      {/* BAGIAN 1: INFO UTAMA (Sama seperti sebelumnya) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-lg text-coffee">Informasi Produk</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Nama Produk</label>
              <input name="name" defaultValue={initialData?.name} required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-gold-accent/20" />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Slug</label>
              <input name="slug" defaultValue={initialData?.slug} placeholder="auto-generate" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
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
            <label className="text-xs font-bold uppercase text-gray-500">Deskripsi</label>
            <textarea name="description" defaultValue={initialData?.description} rows={3} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
        </div>
      </div>

      {/* BAGIAN LINKS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-coffee flex items-center gap-2">
            <Store className="w-5 h-5 text-gold-accent" />
            Daftar Toko & Harga
          </h2>
          <button type="button" onClick={addLink} className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold hover:bg-blue-100 transition flex items-center gap-1">
            <Plus className="w-3 h-3" /> Tambah Toko
          </button>
        </div>

        <div className="space-y-4">
          {links.map((link, index) => (
            <div key={index} className={`p-5 border rounded-2xl space-y-4 relative group transition-all ${!link.isStockReady ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-100'}`}>
              
              <button type="button" onClick={() => removeLink(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10">
                <Trash2 className="w-4 h-4" />
              </button>

              {/* ... INPUT LAINNYA TETAP SAMA ... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                 <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold text-gray-400">Platform</label>
                   <select 
                      value={link.marketplace}
                      onChange={(e) => updateLink(index, "marketplace", e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                   >
                      <option value="SHOPEE">Shopee</option>
                      <option value="TOKOPEDIA">Tokopedia</option>
                      <option value="TIKTOK">TikTok Shop</option>
                      <option value="WHATSAPP_LOKAL">WA Lokal</option>
                      <option value="WEBSITE_RESMI">Web Resmi</option>
                   </select>
                </div>
                {/* ... Store Name & Price ... */}
                 <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold text-gray-400">Nama Toko</label>
                   <input 
                      value={link.storeName}
                      onChange={(e) => updateLink(index, "storeName", e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                   />
                </div>
                 <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold text-gray-400">Harga</label>
                   <input 
                      type="number"
                      value={link.currentPrice || ""}
                      onChange={(e) => updateLink(index, "currentPrice", Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                   />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* ... URL Inputs ... */}
                 <input 
                    placeholder="Original URL"
                    value={link.originalUrl}
                    onChange={(e) => updateLink(index, "originalUrl", e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs"
                 />
                 <input 
                    placeholder="Affiliate URL"
                    value={link.affiliateUrl}
                    onChange={(e) => updateLink(index, "affiliateUrl", e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs"
                 />
              </div>

              {/* ✅ BAGIAN CHECKBOX (BOOLEAN) */}
              <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                
                {/* Toggle Verified */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      // Pastikan checked menerima boolean dari state
                      checked={link.isVerified}
                      // Pastikan onChange mengirim boolean (e.target.checked)
                      onChange={(e) => updateLink(index, "isVerified", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <span className={`text-xs font-bold flex items-center gap-1 ${link.isVerified ? 'text-blue-600' : 'text-gray-400'}`}>
                    <BadgeCheck className="w-3 h-3" /> 
                    Verified
                  </span>
                </label>

                {/* Toggle Stock */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={link.isStockReady}
                      onChange={(e) => updateLink(index, "isStockReady", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                  <span className={`text-xs font-bold flex items-center gap-1 ${link.isStockReady ? 'text-green-600' : 'text-gray-400'}`}>
                    <Box className="w-3 h-3" /> 
                    {link.isStockReady ? "Ready Stock" : "Habis"}
                  </span>
                </label>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* BAGIAN 3: GAMBAR (Sama) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg text-coffee mb-4">Galeri</h2>
        <FormMultiImageUpload name="images" initialData={initialData?.images || []} />
      </div>

      {/* BAGIAN 4: PROS/CONS (Sama) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
            <textarea name="pros" defaultValue={initialData?.pros} placeholder="Kelebihan..." className="w-full p-3 rounded-xl border border-green-200 bg-green-50/50" rows={3}/>
         </div>
         <div className="space-y-2">
            <textarea name="cons" defaultValue={initialData?.cons} placeholder="Kekurangan..." className="w-full p-3 rounded-xl border border-red-200 bg-red-50/50" rows={3}/>
         </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end pb-10">
        <button type="submit" disabled={isPending} className="bg-gold-accent text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 flex items-center gap-2">
           {isPending ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} Simpan Produk
        </button>
      </div>

    </form>
  );
}