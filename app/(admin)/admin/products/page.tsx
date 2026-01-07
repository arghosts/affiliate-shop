import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, ExternalLink } from "lucide-react";
import DeleteButton from "./delete-button"; // ✅ Pastikan import ini ada

// Format Rupiah Helper
const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export const dynamic = "force-dynamic";

export default async function ProductListPage() {
  // Fetch Products dengan Relasi
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      tags: true,
    },
  });

  return (
    <div className="pb-20">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-coffee">Daftar Produk</h1>
          <p className="text-gray-500">Kelola katalog affiliate Anda.</p>
        </div>
        
        <div className="flex gap-3">
          {/* Search Placeholder */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-coffee focus:ring-2 focus:ring-gold-accent/20 outline-none w-64"
            />
          </div>

          <Link
            href="/admin/products/new"
            className="bg-gold-accent text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-gold-accent/20 hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Tambah Produk
          </Link>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Info Produk</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Kategori & Tags</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Harga</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          
          {/* ✅ TBODY LANGSUNG BUNGKUS TR (JANGAN ADA DIV DISINI) */}
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                  Belum ada produk. Silakan tambah baru.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                // ✅ TR ADALAH DIRECT CHILD DARI TBODY
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  
                  {/* Info Produk */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        {product.images[0] ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-coffee group-hover:text-gold-accent transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           {product.shopeeLink && <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-bold">Shopee</span>}
                           {product.tokpedLink && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Tokped</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kategori & Tags */}
                  <td className="p-6">
                    <div className="space-y-2">
                      <span className="inline-block px-3 py-1 bg-coffee/5 text-coffee text-xs font-bold rounded-md uppercase tracking-wider">
                        {product.category?.name || "Uncategorized"}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map(tag => (
                           <span key={tag.id} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                             #{tag.name}
                           </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Harga */}
                  <td className="p-6">
                    <span className="font-black text-coffee">
                      {formatRupiah(Number(product.price))}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={`/product/${product.slug}`} 
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Lihat di Web"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      
                      {/* Link Edit (Akan kita buat setelah ini) */}
                      <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-gray-400 hover:text-gold-accent hover:bg-teal-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      {/* ✅ DELETE BUTTON COMPONENT */}
                      <DeleteButton productId={product.id} />
                      
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}