"use client";

import { ImagePlus, X } from "lucide-react";
import { useState, useRef } from "react";

interface FormImageUploadProps {
  name: string;         // Nama field form (misal: "thumbnail")
  label?: string;
  defaultValue?: string | null; // URL gambar lama (untuk edit)
}

export default function FormImageUpload({ name, label = "Upload Gambar", defaultValue }: FormImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Buat URL lokal sementara untuk preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = ""; // Reset input file
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      
      {/* 1. Input File Asli (Disembunyikan tapi tetap bekerja) */}
      <input
        ref={inputRef}
        type="file"
        name={name} // Ini yang akan dibaca Server Action
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden" 
      />

      {/* 2. Input Hidden untuk menyimpan URL lama (Penting saat Edit!) */}
      {/* Jika user tidak upload file baru, kita kirim balik URL lama ini */}
      <input type="hidden" name={`${name}_existing`} value={defaultValue || ""} />

      {/* 3. Tampilan Preview & Tombol */}
      {!preview ? (
        // Tampilan Belum Ada Gambar
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <div className="bg-gray-100 p-3 rounded-full group-hover:bg-orange-100 transition-colors mb-3">
            <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 2MB)</p>
        </div>
      ) : (
        // Tampilan Sudah Ada Gambar (Preview)
        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover bg-gray-50"
          />
          
          {/* Tombol Ganti / Hapus */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <button
               type="button"
               onClick={() => inputRef.current?.click()}
               className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100"
             >
               Ganti
             </button>
             <button
               type="button"
               onClick={handleRemove}
               className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}