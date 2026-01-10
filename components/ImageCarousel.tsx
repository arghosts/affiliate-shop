"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  // State untuk Desktop (Klik Thumbnail)
  const [activeImage, setActiveImage] = useState<string>(images[0] || "/placeholder.jpg");
  
  // State untuk Mobile (Indikator Dots saat swipe)
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset jika props images berubah
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  // Handler Scroll untuk update active dot di Mobile
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentSlide(index);
    }
  };

  // Safe check jika gambar kosong
  const imageList = images.length > 0 ? images : ["/placeholder.jpg"];

  return (
    <>
      {/* =========================================
          📱 MOBILE VIEW: SWIPEABLE SLIDER (Native)
          Muncul di HP, Hilang di Desktop (md:hidden)
         ========================================= */}
      <div className="block md:hidden relative group">
        
        {/* Container Scroll Snap */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-square bg-white rounded-2xl border border-gray-100"
        >
          {imageList.map((url, index) => (
            <div key={index} className="w-full flex-shrink-0 snap-center flex items-center justify-center relative">
              <img 
                src={url} 
                alt={`${productName} - ${index + 1}`} 
                className="w-full h-full object-contain p-4"
              />
            </div>
          ))}
        </div>

        {/* Indikator Dots (Mobile) */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
            {imageList.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-6 bg-coffee" : "w-2 bg-coffee/20"
                }`}
              />
            ))}
          </div>
        )}

        {/* Indicator jumlah foto (Pojok Kanan Atas) */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
          {currentSlide + 1} / {imageList.length}
        </div>
      </div>


      {/* =========================================
          💻 DESKTOP VIEW: GALLERY STYLE
          Hilang di HP, Muncul di Desktop (hidden md:flex)
         ========================================= */}
      <div className="hidden md:flex flex-col gap-4">
        
        {/* Main Image (Besar) */}
        <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border border-gray-100 p-8 flex items-center justify-center group">
          <img 
            src={activeImage}
            alt={productName}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Thumbnails (Kecil) */}
        {imageList.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {imageList.map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(url)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white p-1 ${
                  activeImage === url
                    ? "border-gold-accent opacity-100 ring-2 ring-gold-accent/20"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-coffee/10"
                }`}
              >
                <img 
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}