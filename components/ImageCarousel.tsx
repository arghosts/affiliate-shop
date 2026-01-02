"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Definisi tipe data yang diterima komponen
interface ImageType {
  id: string;
  url: string;
  // Kita biarkan productId opsional atau tidak ditulis karena tidak dipakai di UI ini
}

interface ImageCarouselProps {
  images: ImageType[];
  productName: string; // ✅ MENAMBAHKAN INI UNTUK FIX ERROR
}

export default function ImageCarousel({ 
  images, 
  productName 
}: ImageCarouselProps) {
  
  // Fallback jika gambar kosong
  const safeImages = images.length > 0 ? images : [{ id: "default", url: "/file.svg" }];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-6">
      {/* --- Main Image Viewport --- */}
      {/* Menggunakan bg-surface sesuai tema */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface border border-surface shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-8" // Padding agar gambar tidak mentok pinggir
          >
            <Image
              src={safeImages[activeIndex].url}
              alt={`${productName} - View ${activeIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Badge jumlah gambar */}
        <div className="absolute bottom-4 right-4 bg-coffee text-warm-bg text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest opacity-80">
          {activeIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* --- Thumbnails --- */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {safeImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                idx === activeIndex
                  ? "border-gold-accent ring-2 ring-gold-accent/20 grayscale-0" // Active: Teal Border
                  : "border-transparent opacity-60 hover:opacity-100 grayscale" // Inactive: Grayscale biar fokus ke main image
              }`}
            >
              <Image
                src={img.url}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}