"use client";

import Link from "next/link";
import { ShoppingBag, ExternalLink, BadgeCheck, Store } from "lucide-react";
import { MarketplaceType } from "@prisma/client";
import { useState, useEffect } from "react"; // 1. Tambah Import ini

// --- 2. BANK KATA-KATA (Opsi Random) ---
const CTA_OPTIONS = [
  "Intip Harga Promo",
  "Cek Diskon App",
  "Amankan Stok",
  "Cek Harga Asli",
  "Lihat Voucher",
];

const BADGE_OPTIONS = [
  "🔥 Paling Worth",
  "✅ Admin Approved",
  "⚡ Anti Boncos",
  "👑 Juara Kelas",
  "💎 Hidden Gem",
];
// Helper format rupiah
const formatRupiah = (num: number) => 
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

interface BestDealProps {
  marketplace: MarketplaceType;
  storeName: string;
  url: string;
  price: number;
}

interface FloatingCTAProps {
  bestDeal: BestDealProps | null; // Bisa null jika tidak ada toko verified
}

export default function FloatingCTA({ bestDeal }: FloatingCTAProps) {
  // --- 3. STATE UNTUK TEXT DINAMIS ---
  // Default value diisi agar Server & Client sinkron saat loading awal (mencegah error hydration)
  const [ctaText, setCtaText] = useState("Cek Harga & Stok");
  const [badgeText, setBadgeText] = useState("🔥 Paling Worth");

  // --- 4. EFEK RANDOMIZER (Hanya jalan di browser) ---
  useEffect(() => {
    const randomCTA = CTA_OPTIONS[Math.floor(Math.random() * CTA_OPTIONS.length)];
    const randomBadge = BADGE_OPTIONS[Math.floor(Math.random() * BADGE_OPTIONS.length)];
    
    setCtaText(randomCTA);
    setBadgeText(randomBadge);
  }, []);
  // Jika tidak ada deal (misal semua toko belum verified / stok habis), sembunyikan CTA
  if (!bestDeal) return null;

  // Helper Warna Tombol
  const getButtonColor = (mp: MarketplaceType) => {
    switch (mp) {
      case 'SHOPEE': return 'bg-[#EE4D2D] hover:bg-[#d03e1f] text-coffee';
      case 'TOKOPEDIA': return 'bg-[#03AC0E] hover:bg-[#028a0b]';
      case 'TIKTOK': return 'bg-black hover:bg-gray-800';
      case 'WHATSAPP_LOKAL': return 'bg-[#25D366] hover:bg-[#1da851]';
      default: return 'bg-coffee hover:bg-gold-accent';
    }
  };

  return (
    // ✅ 1. HAPUS 'md:hidden' agar muncul di Desktop juga.
    // Tambahkan 'z-50' agar selalu di atas.
    <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4 sm:pb-6 pointer-events-none">
      
      {/* Container Floating (Di tengah layar, rounded) */}
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4 pointer-events-auto ring-1 ring-black/5">
        
        {/* Info Harga & Toko */}
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 mb-1">
             <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
               <BadgeCheck className="w-3 h-3" /> {badgeText}
             </span>
             <span className="hidden sm:inline text-zinc-600">• {bestDeal.storeName}</span>
           </div>
           
           <div className="flex items-baseline gap-2">
             <span className="font-black text-xl text-zinc-900 leading-none">
               {formatRupiah(bestDeal.price)}
             </span>
             <span className="text-[10px] text-zinc-600 font-medium hidden sm:inline">
                 Awas Promo App Murah!
             </span>
           </div>
        </div>

        {/* Tombol Action */}
        <Link
          href={bestDeal.url}
          target="_blank"
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 shadow-lg shadow-gray-200 transition-transform hover:-translate-y-1 ${getButtonColor(bestDeal.marketplace)}`}
        >
          {bestDeal.marketplace === 'WHATSAPP_LOKAL' ? 'Chat Penjual' : ctaText}
          <ExternalLink className="w-4 h-4" />
        </Link>

      </div>
    </div>
  );
}