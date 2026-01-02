"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react"; // Hapus Zap jika tidak dipakai
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
    <section className="relative overflow-hidden bg-warm-bg pt-16 lg:pt-20 pb-24">
      
      {/* --- Background Decor --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold-accent/10 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-coffee/5 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob animation-delay-2000" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT COLUMN: Dynamic Content --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Promo Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-coffee/10 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-coffee shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-accent"></span>
              </span>
              {promo}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-coffee tracking-tighter leading-[0.95] mb-6">
              {title}
            </h1>
            
            <p className="text-lg text-muted-brown leading-relaxed font-medium max-w-lg mb-8">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={primaryBtnLink}
                className="w-full sm:w-auto rounded-xl bg-coffee px-8 py-4 text-sm font-bold text-warm-bg shadow-lg shadow-coffee/20 hover:bg-gold-accent hover:shadow-gold-accent/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                {primaryBtnText} <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                href={secondaryBtnLink} 
                className="w-full sm:w-auto px-6 py-4 text-sm font-bold text-coffee hover:text-gold-accent transition-colors text-center uppercase tracking-wider"
              >
                {secondaryBtnText}
              </Link>
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN: Visuals --- */}
          <div className="relative w-full h-[400px] lg:h-[500px] hidden lg:block perspective-1000">
             
             {/* LOGIC: Jika ada gambar, tampilkan gambar. Jika tidak, tampilkan animasi. */}
             {heroImage ? (
                // OPSI 1: GAMBAR DINAMIS
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={heroImage} 
                    alt="Hero Image"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
             ) : (
                // OPSI 2: ANIMASI ABSTRAK & DEKORASI
                // Kita bungkus pakai Fragment <>...</> agar elemen dekorasi (Star/Shield)
                // HANYA muncul saat mode animasi, bukan saat mode gambar.
                <>
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-white rounded-3xl shadow-2xl shadow-coffee/10 border border-surface flex flex-col items-center justify-center p-6 z-20"
                  >
                      <div className="w-full h-48 bg-surface/50 rounded-xl mb-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-surface to-white opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-accent/30"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-1 h-20">
                            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                              <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="w-full bg-coffee/10 rounded-t-sm" 
                              />
                            ))}
                        </div>
                      </div>
                      <div className="w-full space-y-3">
                        <div className="h-3 w-3/4 bg-coffee/10 rounded-full"></div>
                        <div className="h-3 w-1/2 bg-coffee/10 rounded-full"></div>
                      </div>
                  </motion.div>

                  {/* Decor Elements (Hanya muncul jika tidak ada gambar) */}
                  <motion.div animate={{ y: [0, 15, 0], x: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] right-[15%] bg-white p-4 rounded-2xl shadow-xl shadow-gold-accent/10 border border-gold-accent/20 z-30">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gold-accent/10 rounded-full"><Star className="w-5 h-5 text-gold-accent fill-gold-accent" /></div>
                        <div><p className="text-[10px] font-bold text-muted-brown uppercase">Rating</p><p className="text-lg font-black text-coffee">9.8/10</p></div>
                      </div>
                  </motion.div>
                  <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[20%] left-[10%] bg-coffee p-4 rounded-2xl shadow-xl z-30">
                      <ShieldCheck className="w-8 h-8 text-warm-bg" />
                  </motion.div>
                </>
             )}
          </div>
        </div>
      </div>
    </section>
  );
}