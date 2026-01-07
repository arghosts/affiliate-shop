"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Opsional: Bisa pakai <img> biasa jika mau simple

interface ImageCarouselProps {
  // 👇 UPDATE: Sekarang menerima array string, bukan object
  images: string[]; 
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  // State untuk gambar yang sedang aktif (ditampilkan besar)
  const [activeImage, setActiveImage] = useState<string>(images[0] || "/placeholder.jpg");

  // Reset active image jika props images berubah
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Image (Besar) */}
      <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border border-gray-100 p-4 flex items-center justify-center">
        {/* Menggunakan <img> biasa agar aman dari masalah config domain Next.js sementara ini */}
        <img 
          src={activeImage}
          alt={productName}
          className="object-contain w-full h-full hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Thumbnails (Kecil) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((url, index) => (
            <button
              key={index} // Gunakan index sebagai key karena URL string unik
              onClick={() => setActiveImage(url)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === url
                  ? "border-gold-accent opacity-100 ring-2 ring-gold-accent/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img 
                src={url}
                alt={`${productName} view ${index + 1}`}
                className="object-cover w-full h-full bg-white"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}