"use client";

import { useState, useEffect } from "react";
import { Search, Link as LinkIcon, X } from "lucide-react";

interface SimpleProduct {
  id: string;
  name: string;
  slug: string;
}

export default function ProductPicker({ 
  initialValue, 
  products 
}: { 
  initialValue?: string;
  products: SimpleProduct[];
}) {
  const [selectedLink, setSelectedLink] = useState(initialValue || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter produk berdasarkan ketikan
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Saat produk dipilih
  const handleSelect = (slug: string) => {
    // Kita simpan format URL internal
    const url = `/product/${slug}`;
    setSelectedLink(url);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-gray-500">Tautkan Produk (Opsional)</label>
      
      {/* Input Hidden yang akan dikirim ke Server Action */}
      <input type="hidden" name="referenceLink" value={selectedLink} />

      {/* Tampilan Jika Sudah Ada Link Terpilih */}
      {selectedLink ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700 text-sm font-bold overflow-hidden">
            <LinkIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{selectedLink}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSelectedLink("")}
            className="p-1 hover:bg-blue-100 rounded-full text-blue-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Tampilan Pencarian */
        <div className="relative">
          <div 
            className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-3 cursor-text focus-within:ring-2 focus-within:ring-gold-accent/20"
            onClick={() => setIsOpen(true)}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text"
              placeholder="Cari produk untuk ditautkan..."
              className="bg-transparent outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          {/* Dropdown Hasil Search */}
          {isOpen && searchTerm && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-xs text-gray-400 text-center">Produk tidak ditemukan</div>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect(p.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-50 last:border-0"
                  >
                    {p.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
      <p className="text-[10px] text-gray-400">
        *Artikel akan memiliki tombol "Cek Harga" yang mengarah ke halaman produk tersebut.
      </p>
    </div>
  );
}