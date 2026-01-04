"use client"; // Wajib client karena ada interaksi UI (opsional, tapi aman)

import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react"; // Pastikan install lucide-react

// Helper format rupiah
const formatRupiah = (num: number) => 
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

interface FloatingCTAProps {
  price: number;
  shopeeLink?: string | null;
  tokpedLink?: string | null;
}

export default function FloatingCTA({ price, shopeeLink, tokpedLink }: FloatingCTAProps) {
  // Jika tidak ada link sama sekali, jangan render apa-apa
  if (!shopeeLink && !tokpedLink) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 md:hidden">
      {/* md:hidden artinya komponen ini HILANG di layar laptop/desktop. 
         Biasanya desktop user lebih suka tombol di sebelah kanan/atas.
         Kalau mau muncul terus, hapus 'md:hidden'.
      */}
      
      <div className="flex items-center gap-3 justify-between max-w-md mx-auto">
        
        {/* Info Harga (Kiri) */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Harga Terbaik</span>
          <span className="font-bold text-lg text-gray-900 leading-tight">
            {formatRupiah(price)}
          </span>
        </div>

        {/* Tombol Action (Kanan) */}
        <div className="flex gap-2 flex-1 justify-end">
          
          {/* Tombol Tokopedia (Hijau) - Muncul jika link ada */}
          {tokpedLink && (
            <Link
              href={tokpedLink}
              target="_blank"
              className={`flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-green-700 transition-colors ${
                shopeeLink ? "flex-1 text-sm" : "w-full"
              }`}
            >
              <ShoppingBag size={18} />
              {shopeeLink ? "Tokped" : "Beli di Tokped"}
            </Link>
          )}

          {/* Tombol Shopee (Oranye) - Muncul jika link ada */}
          {shopeeLink && (
            <Link
              href={shopeeLink}
              target="_blank"
              className={`flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-orange-600 transition-colors ${
                tokpedLink ? "flex-1 text-sm" : "w-full"
              }`}
            >
              <ShoppingCart size={18} />
              {tokpedLink ? "Shopee" : "Beli di Shopee"}
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}