"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

// 1. Pisahkan Logic ke komponen internal (bukan default export)
function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook ini aman karena dibungkus Suspense di parent
  
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}#products`);
    } else {
      router.push("/");
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
        placeholder="Beli apa hari ini..." 
        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm font-bold text-coffee focus:ring-2 focus:ring-gold-accent/20 outline-none transition-all placeholder:text-gray-400/80"
      />
    </form>
  );
}

// 2. Export Default hanyalah Wrapper (Pembungkus)
export default function SearchBar() {
  return (
    // Suspense diletakkan di sini untuk membungkus komponen yang pakai useSearchParams
    <Suspense fallback={<div className="w-64 h-10 bg-gray-100 rounded-full animate-pulse" />}>
      <SearchBarContent />
    </Suspense>
  );
}