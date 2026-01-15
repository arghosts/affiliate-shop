"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman full
    
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}#products`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block w-64 group">
      {/* PERUBAHAN DISINI: 
         1. Ikon Search dibungkus <button type="submit">
         2. Tambah hover effect biar user tau ini bisa diklik 
         3. Posisi disesuaikan sedikit agar area klik (hitbox) aman
      */}
      <button 
        type="submit"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-coffee hover:bg-gray-200/50 transition-all z-10"
        aria-label="Cari Produk"
      >
        <Search className="w-4 h-4" />
      </button>

      <input 
        type="text"
        id="search-input"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Beli apa hari ini..." 
        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm font-bold text-coffee focus:ring-2 focus:ring-gold-accent/20 outline-none transition-all placeholder:text-gray-400/80"
      />
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="w-64 h-10 bg-gray-100 rounded-full animate-pulse" />}>
      <SearchBarContent />
    </Suspense>
  );
}