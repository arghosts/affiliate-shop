"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2 } from "lucide-react";

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
  }).format(Number(product.price));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-surface shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Background ganti ke Surface (Cream lembut) */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3">
          {/* Badge Category mengikuti tema Coffee */}
          <span className="px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase bg-coffee/90 backdrop-blur-md rounded-full">
            {product.category || "Gadget"}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div>
          {/* Judul: Coffee */}
          <h3 className="text-lg font-black text-coffee line-clamp-2 leading-tight tracking-tight">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-brown">
             <CheckCircle2 className="w-4 h-4 text-gold-accent" />
             <span>Rekomendasi Editor</span>
          </div>
        </div>

        <div className="mt-4">
          {/* Harga: Gold Accent (Teal) */}
          <p className="text-xl font-black text-gold-accent">
            {formattedPrice}
          </p>
          <p className="text-xs text-muted-brown/60 mt-1 font-medium">Harga perkiraan marketplace</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {/* Tombol Shopee & Tokped TETAP pakai warna Brand mereka (UX Law: Recognition) */}
          {product.shopeeLink ? (
            <a
              href={product.shopeeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#EE4D2D] rounded-lg hover:bg-[#d03e1f] transition-colors shadow-sm"
            >
              Shopee <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
             <button disabled className="px-4 py-2.5 text-xs font-bold text-muted-brown bg-surface rounded-lg cursor-not-allowed">
                Habis
             </button>
          )}

          {/* Tombol Detail: Pakai Theme Style */}
          {product.tokpedLink ? (
            <a
              href={product.tokpedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#42B549] rounded-lg hover:bg-[#36963c] transition-colors shadow-sm"
            >
              Tokopedia <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <Link 
              href={`/product/${product.slug}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-coffee bg-surface rounded-lg hover:bg-surface/80 transition-colors"
            >
              Detail
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}