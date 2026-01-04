"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil nilai default dari URL jika ada (biar input gak kosong pas di-refresh)
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman full
    
    // Redirect ke Homepage dengan parameter ?q=...
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}#products`);
    } else {
      router.push("/"); // Kalau kosong, balik ke home murni
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input 
        type="text"
        id="search-input"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari set up..." 
        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm font-bold text-coffee focus:ring-2 focus:ring-gold-accent/20 outline-none transition-all placeholder:text-gray-400/80"
      />
    </form>
  );
}