"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import FormImageUpload from "@/components/FormImageUpload";

// Import Editor Lazy Load
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface PostFormProps {
  initialData?: any; 
  // Action signature yang kita harapkan
  action: (id: string | null, prevState: any, formData: FormData) => Promise<any>; 
}

export default function PostForm({ initialData, action }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // State Content
  const [contentJson, setContentJson] = useState<any>(
    initialData?.content ? (typeof initialData.content === 'string' ? JSON.parse(initialData.content) : initialData.content) : null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validasi Editor
    if (!contentJson || (contentJson.blocks && contentJson.blocks.length === 0)) {
      alert("Konten tidak boleh kosong!");
      setLoading(false);
      return;
    }

    // Masukkan JSON ke FormData
    formData.set("content", JSON.stringify(contentJson));

    // PANGGIL ACTION DENGAN URUTAN YANG BENAR:
    // Arg 1: ID (jika edit) atau null (jika create)
    // Arg 2: null (sebagai dummy prevState)
    // Arg 3: formData (isi form)
    
    try {
        const result = await action(initialData?.id || null, null, formData);

        if (result?.status === "success") {
          // Redirect biasanya sudah dihandle server, tapi kalau client component kadang butuh refresh
          // router.push("/admin/posts"); // Opsional, tergantung action redirect
          router.push("/admin/posts");
          router.refresh();
        } else {
           // Jika ada error message dari server
           alert(result?.message || "Gagal menyimpan.");
        }
    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan sistem.");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? "Edit Artikel" : "Tulis Artikel Baru"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Input Judul */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Artikel</label>
          <input
            name="title"
            type="text"
            defaultValue={initialData?.title}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            placeholder="Contoh: Review Jujur iPhone 15"
          />
        </div>

        {/* Input Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (Opsional)</label>
          <input
            name="slug"
            type="text"
            defaultValue={initialData?.slug}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-600 text-sm"
            placeholder="biarkan-kosong-auto-generate"
          />
        </div>

        {/* IMAGE UPLOAD COMPONENT (Pengganti Input URL) */}
        <FormImageUpload 
          name="thumbnail" 
          label="Thumbnail Artikel" 
          defaultValue={initialData?.thumbnail} 
        />

        {/* SECTION LINK AFFILIATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link Shopee (Opsional)</label>
            <input
              name="shopeeLink"
              type="url"
              defaultValue={initialData?.shopeeLink || ""}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="https://shope.ee/..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link Tokopedia (Opsional)</label>
            <input
              name="tokpedLink"
              type="url"
              defaultValue={initialData?.tokpedLink || ""}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="https://tokopedia.link/..."
            />
          </div>
        </div>

        {/* EDITOR */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Konten</label>
          <div className="bg-gray-50 p-1 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all min-h-[400px]">
            <Editor 
              holder="editorjs-edit-container" 
              data={contentJson} 
              onChange={(data) => setContentJson(data)} 
            />
          </div>
        </div>

        {/* Tombol Action */}
        <div className="flex justify-end pt-6 border-t border-gray-100 gap-4">
           <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white px-8 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-bold shadow-lg shadow-orange-200"
          >
            {loading ? "Menyimpan..." : (initialData ? "Update Artikel" : "Publish Artikel")}
          </button>
        </div>
      </form>
    </div>
  );
}