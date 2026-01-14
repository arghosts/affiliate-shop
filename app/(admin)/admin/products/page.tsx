import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, ExternalLink } from "lucide-react";
import DeleteButton from "./delete-button";

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
  // ✅ Fetch Products dengan Schema Baru
  // Kita ambil minPrice dan hitung jumlah link toko
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      tags: true,
      _count: {
        select: { links: true } // Hitung jumlah toko tersedia
      }
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
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-accent/20"
            />
          </div>
          <Link 
            href="/admin/products/new" 
            className="bg-coffee text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-coffee/20"
          >
            <Plus className="w-4 h-4" /> Tambah Produk
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Produk</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Harga Terbaik</th>
              <th className="p-6 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  Belum ada produk. Silakan tambah produk baru.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  
                  {/* Info Produk */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-200">
                        {product.images[0] ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-coffee group-hover:text-gold-accent transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          {product.isFeatured && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Featured</span>
                          )}
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                            {product._count.links} Toko Aktif
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="p-6">
                    {product.category ? (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs italic">Uncategorized</span>
                    )}
                  </td>

                  {/* ✅ UPDATE: HARGA (Gunakan minPrice) */}
                  <td className="p-6 font-mono text-sm">
                    <span className="font-bold text-coffee">
                      {product.minPrice 
                        ? formatRupiah(Number(product.minPrice)) 
                        : "Cek Detail"}
                    </span>
                    <span className="block text-[10px] text-gray-400">Mulai dari</span>
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
                      
                      <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-gray-400 hover:text-gold-accent hover:bg-teal-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
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