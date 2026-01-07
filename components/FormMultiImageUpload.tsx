"use client";

import { ImagePlus, X } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface FormMultiImageUploadProps {
  name: string;
  initialData?: string[]; // Array URL
  maxFiles?: number;
}

export default function FormMultiImageUpload({ name, initialData = [], maxFiles = 6 }: FormMultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    if (previews.length + newFiles.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} foto.`);
      return;
    }

    // Generate Preview Lokal
    Array.from(newFiles).forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, objectUrl]);
    });
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    // Reset input agar bisa upload file yang sama jika dihapus
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Galeri Produk ({previews.length}/{maxFiles})
        </label>
        
        {/* Tombol Tambah Custom */}
        {previews.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold bg-gray-100 hover:bg-gold-accent hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <ImagePlus className="w-4 h-4" /> Tambah Foto
          </button>
        )}
      </div>

      {/* Grid Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((url, index) => (
          <div key={`${url}-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
            
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>

            {/* TRICK: Input Hidden untuk URL lama */}
            {/* Jika URL adalah link http (bukan blob), kirim sebagai 'existing_images' */}
            {url.startsWith("http") && (
              <input type="hidden" name="existing_images" value={url} />
            )}
          </div>
        ))}

        {/* Input File Asli (Hidden) */}
        {/* 'multiple' attribute allows selecting multiple files */}
        <input
          ref={fileInputRef}
          type="file"
          name={name} 
          accept="image/*"
          multiple 
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">* Foto pertama akan menjadi thumbnail utama.</p>
    </div>
  );
}