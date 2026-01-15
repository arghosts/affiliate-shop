"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

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
          ========================================= */}
      <div className="md:hidden -mx-4 relative">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {imageList.map((url, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-full snap-center px-4"
            >
              <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border border-gray-100 p-6 flex items-center justify-center">
                <Image 
                  // Optimasi ImageKit: Resize ke 500px untuk Mobile
                  src={`${url}?tr=w-300,h-300,fo-auto`}
                  alt={`${productName} - Slide ${index + 1}`}
                  fill
                  // PENTING: Hanya gambar pertama yang boleh 'priority'
                  priority={index === 0}
                  fetchPriority="high"
                  // Memberitahu browser ukuran yang sebenarnya dipakai
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Indikator Dots */}
        {imageList.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {imageList.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentSlide === index ? "w-6 bg-gold-accent" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>


      {/* =========================================
          💻 DESKTOP VIEW: GALLERY STYLE
          Hilang di HP, Muncul di Desktop (hidden md:flex)
         ========================================= */}
      <div className="hidden md:flex flex-col gap-4">
        
        {/* Main Image (Besar) */}
        <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border border-gray-100 p-8 flex items-center justify-center group">
          <Image 
            src={`${activeImage}?tr=w-600,h-600,fo-auto`}
            alt={productName}
            fill // Mengisi container div
            priority // PENTING: Memberitahu browser ini LCP
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" // Membantu browser pilih ukuran
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
                <Image 
                  src={`${url}?tr=w-100,h-100,fo-auto`}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
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