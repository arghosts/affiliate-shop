"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  title: string;
  promo: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  heroImage?: string | null;
}

export default function Hero({ 
  title, 
  promo, 
  description,
  primaryBtnText,
  primaryBtnLink,
  secondaryBtnText,
  secondaryBtnLink,
  heroImage
}: HeroProps) {
  return (
    // 1. BACKGROUND BASE: Diganti ke Putih Gading (#FDFCF8) agar kontras dikit dengan warm-bg di bawah
    <section className="relative overflow-hidden bg-[#FDFCF8] pt-24 lg:pt-32 pb-32">

      {/* 2. BACKGROUND DECOR (Blobs & Grid) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* Blob Gold - Opacity dikurangi biar lebih soft */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob" />
        {/* Blob Coffee - Opacity dikurangi biar lebih soft */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-coffee/5 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000" />
        
        {/* Grid Pattern Halus */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content (Text) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
             {/* Promo Badge */}
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-accent/10 border border-gold-accent/20 text-gold-accent text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-gold-accent" />
                {promo}
             </div>

             {/* Title dengan Mapping Warna */}
             <h1 className="text-4xl lg:text-6xl font-black text-coffee tracking-tighter leading-[1.1] mb-6">
               {title.split(" ").map((word, i) => (
                 <span key={i} className={i === 1 ? "text-gold-accent" : ""}>
                   {word}{" "}
                 </span>
               ))}
             </h1>

             {/* Description */}
             <p className="text-muted-brown text-lg font-medium leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
               {description}
             </p>

             {/* Buttons */}
             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <Link href={primaryBtnLink} className="bg-coffee text-white px-8 py-4 rounded-xl font-bold hover:bg-gold-accent transition-all shadow-lg shadow-coffee/20 flex items-center justify-center gap-2 group">
                 {primaryBtnText}
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href={secondaryBtnLink} className="bg-white text-coffee border border-coffee/10 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                 <ShieldCheck className="w-4 h-4" />
                 {secondaryBtnText}
               </Link>
             </div>
          </motion.div>

          {/* Right Content (Image & Floating Cards) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
             {/* Glass Container Image */}
             <div className="relative z-20 bg-white/60 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/80 shadow-2xl shadow-coffee/5">
                {heroImage ? (
                   <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100">
                     <Image src={heroImage} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 1px, 50vw" />
                   </div>
                ) : (
                   // Placeholder Animation jika tidak ada gambar
                   <div className="aspect-square bg-gradient-to-br from-gray-50 to-white rounded-[2rem] flex items-center justify-center relative overflow-hidden border border-gray-100">
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-4 w-full px-12"
                      >
                        <div className="h-4 w-full bg-coffee/5 rounded-full"></div>
                        <div className="h-4 w-2/3 bg-coffee/5 rounded-full"></div>
                        <div className="h-32 w-full bg-coffee/5 rounded-2xl mt-4"></div>
                      </motion.div>
                   </div>
                )}
             </div>

             {/* Decor Elements (Floating Cards) - Tetap dipertahankan */}
             <motion.div 
                animate={{ y: [0, 15, 0], x: [0, -5, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                className="absolute top-[20%] right-[-5%] bg-white p-4 rounded-2xl shadow-xl shadow-gold-accent/10 border border-gold-accent/20 z-30"
             >
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gold-accent/10 rounded-full">
                      <Star className="w-5 h-5 text-gold-accent fill-gold-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-brown uppercase tracking-wider">Editor's Choice</p>
                      <p className="text-lg font-black text-coffee leading-none">7/10</p>
                    </div>
                  </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
                className="absolute bottom-[10%] left-[-5%] bg-coffee p-4 rounded-2xl shadow-xl shadow-coffee/20 z-30"
              >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-coffee" />
                       <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-coffee" />
                       <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-coffee" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white/80">Trusted by</p>
                       <p className="text-sm font-black text-white">Real Users</p>
                    </div>
                  </div>
              </motion.div>

          </motion.div>
        </div>
      </div>

      {/* 4. BOTTOM FADE SEPARATOR (Gradasi Halus ke bawah) */}
      {/* Ini yang membuat Hero menyatu lembut dengan list produk */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-bg to-transparent z-10 pointer-events-none" />

    </section>
  );
}