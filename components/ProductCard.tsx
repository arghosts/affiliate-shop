"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Store, MapPin } from "lucide-react"; // Icon tambahan

interface ProductProps {
  id: string;
  name: string;
  slug: string;
  minPrice: number; // ✅ Ganti price jadi minPrice
  image: string;
  category: string;
  storeCount?: number; // ✅ Info jumlah toko
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.minPrice || 0);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-surface shadow-sm hover:shadow-xl transition-all duration-300 h-full"
    >
      {/* 1. LINK FULL CARD (Klik di mana saja lari ke detail) */}
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Lihat detail {product.name}</span>
      </Link>

      {/* 2. GAMBAR */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Badge Kategori */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-coffee/90 backdrop-blur-sm rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* 3. KONTEN */}
      <div className="flex flex-col flex-grow p-4">
        {/* Judul */}
        <h3 className="mb-2 text-2xl font-bold text-coffee line-clamp-2 group-hover:text-gold-accent transition-colors">
          {product.name}
        </h3>

        {/* Harga & Info Toko */}
        <div className="mt-auto space-y-2">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Mulai dari</p>
            <p className="text-lg font-black text-gold-accent">
              {formattedPrice}
            </p>
          </div>

          {/* Footer Card: Info Jumlah Toko */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-gray-400" />
              <span>{product.storeCount ? `${product.storeCount} Toko` : "Cek Stok"}</span>
            </div>
            <span className="text-gold-accent font-bold text-[10px] uppercase tracking-wider group-hover:underline">
              Cek Harga →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}