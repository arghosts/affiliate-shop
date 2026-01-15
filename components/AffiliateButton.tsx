"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

const BTN_TEXTS = ["Cek Promo", "Intip Harga", "Gas Ke Toko", "Amankan Stok", "Lihat Diskon"];

interface AffiliateButtonProps {
  url: string;
  className?: string; // Terima class warna dari server
}

export default function AffiliateButton({ url, className }: AffiliateButtonProps) {
  // Default text aman untuk SEO/Server
  const [text, setText] = useState("Cek Toko");

  // Randomizer jalan di browser
  useEffect(() => {
    const random = BTN_TEXTS[Math.floor(Math.random() * BTN_TEXTS.length)];
    setText(random);
  }, []);

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={className} // Pakai style yang dikirim dari server
    >
      {text} 
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}