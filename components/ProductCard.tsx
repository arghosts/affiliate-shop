"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ProductProps {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  image: string;
  category: string;
  shopeeLink?: string | null;
  tokpedLink?: string | null;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      // Tambahkan 'relative' dan 'group' untuk positioning
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-surface shadow-sm hover:shadow-xl transition-all duration-300 h-full"
    >
      
      {/* --- 1. LINK UTAMA (OVERLAY) --- */}
      {/* Link ini menutupi seluruh kartu (absolute inset-0) */}
      {/* z-10 agar di atas konten biasa, tapi di bawah tombol Shopee (z-20) */}
      <Link 
        href={`/product/${product.slug}`} 
        className="absolute inset-0 z-10"
        aria-label={`Lihat detail ${product.name}`}
      >
        <span className="sr-only">Lihat Detail</span>
      </Link>

      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          
          // --- 2. OPTIMASI SPEED INSIGHTS (MOBILE SCORE) ---
          // Ini memberi tahu browser: 
          // "Di HP (max-width 640px), ambil gambar lebar penuh (100vw).
          //  Di Tablet (max-width 1024px), ambil setengah lebar (50vw).
          //  Di Laptop, ambil sepertiga lebar (33vw)."
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          
          loading="lazy" // Pastikan lazy load aktif
        />
        
        {/* Badge Kategori */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-coffee border border-surface shadow-sm z-10">
          {product.category}
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-bold text-coffee text-base leading-snug line-clamp-2 mb-2 group-hover:text-gold-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-gold-accent font-black text-lg">
            {formattedPrice}
          </p>
        </div>

        {/* --- ACTION BUTTONS --- */}
        {/* Tambahkan 'relative z-20' agar tombol ini berada DI ATAS Link Overlay */}
        {/* Jadi kalau klik tombol Shopee -> ke Shopee. Klik area lain -> ke Detail Produk. */}
        <div className="mt-auto grid grid-cols-2 gap-2 relative z-20">
          
          {/* Tombol Shopee */}
          {product.shopeeLink ? (
            <a
              href={product.shopeeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-bold text-white bg-[#EE4D2D] rounded-lg hover:bg-[#d03e1f] transition-colors shadow-sm"
            >
              Shopee <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
             <button disabled className="px-3 py-2.5 text-[10px] sm:text-xs font-bold text-muted-brown bg-surface rounded-lg cursor-not-allowed border border-coffee/10">
                Habis
             </button>
          )}

          {/* Tombol Tokopedia */}
          {product.tokpedLink ? (
            <a
              href={product.tokpedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-bold text-white bg-[#42B549] rounded-lg hover:bg-[#36963c] transition-colors shadow-sm"
            >
              Tokopedia <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            // Jika tidak ada link Tokped, tombol ini jadi shortcut ke Detail
            // Kita pakai <a> atau <button> palsu karena Link sudah ada di overlay
            <div 
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-bold text-coffee bg-white border border-coffee/10 rounded-lg hover:bg-surface transition-colors cursor-pointer"
            >
              Detail <ExternalLink className="w-3 h-3" />
            </div>
          )}
          
        </div>
      </div>
    </motion.div>
  );
}