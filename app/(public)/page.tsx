import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero"; 
import Link from "next/link";
import { X } from "lucide-react";

export const revalidate = 0; // Dynamic Rendering (Agar search params selalu fresh)

// Menerima Props `searchParams` dari URL
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; tag?: string }>;
}) {
  const params = await searchParams; // Next.js 15+ butuh await searchParams
  const query = params.q || "";
  const catFilter = params.cat || "";
  const tagFilter = params.tag || "";

  // 1. Logic Filter Dinamis
  const whereCondition: any = {};

  // Jika ada pencarian text
  if (query) {
    whereCondition.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  // Jika ada filter kategori
  if (catFilter) {
    whereCondition.category = { slug: catFilter };
  }

  // Jika ada filter tag
  if (tagFilter) {
    whereCondition.tags = { some: { slug: tagFilter } };
  }

  // 3. Fetch Products dengan Schema Baru
  const products = await prisma.product.findMany({
    where: whereCondition,
    take: 12, // Batasi 12 produk di halaman depan
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      // ✅ Hitung jumlah toko (links) untuk ditampilkan di card "2 Toko"
      _count: {
        select: { links: true }
      }
    },
  });

  // 3. Fetch Sidebar Data (Categories & Tags) untuk Filter Menu
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  const tags = await prisma.tag.findMany();
  const siteSettings = await prisma.siteSetting.findFirst();

  // Helper Hero Data
  const heroData = {
    title: siteSettings?.heroTitle ?? "Belanja Pilihan Masa Kini",
    promo: siteSettings?.heroPromo ?? "Independent Review",
    description: siteSettings?.heroDescription ?? "Belanja Tanpa Rasa Takut Zonk.",
    primaryBtnText: siteSettings?.primaryBtnText ?? "Mulai Belanja",
    primaryBtnLink: siteSettings?.primaryBtnLink ?? "#products",
    secondaryBtnText: siteSettings?.secondaryBtnText ?? "Cari Review",
    secondaryBtnLink: siteSettings?.secondaryBtnLink ?? "/blog",
    heroImage: siteSettings?.heroImage, 
  };

  const isFiltering = query || catFilter || tagFilter;

  return (
    <div className="bg-warm-bg min-h-screen pb-20">
      
      {/* Tampilkan Hero HANYA jika TIDAK sedang searching/filtering */}
      {!isFiltering && (
        <Hero 
          title={heroData.title}
          promo={heroData.promo}
          description={heroData.description}
          primaryBtnText={heroData.primaryBtnText}
          primaryBtnLink={heroData.primaryBtnLink}
          secondaryBtnText={heroData.secondaryBtnText}
          secondaryBtnLink={heroData.secondaryBtnLink}
          heroImage={heroData.heroImage}
        />
      )}

      {/* PRODUCT SECTION */}
      <section id="products" className={`container mx-auto px-6 scroll-mt-24 ${isFiltering ? "pt-32" : "mt-12"}`}>
        
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* --- SIDEBAR FILTER (Kiri) --- */}
          <div className="w-full md:w-64 shrink-0 space-y-8">
            {/* Filter Categories */}
            <div>
              <h1 className="font-black text-coffee uppercase tracking-widest text-xs mb-4">Kategori</h1>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className={`text-sm font-bold ${!catFilter ? "text-gold-accent" : "text-muted-brown hover:text-gold-accent"}`}>
                    Semua Produk
                  </Link>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <Link 
                      href={`/?cat=${c.slug}#products`} 
                      className={`text-sm font-medium flex justify-between items-center ${catFilter === c.slug ? "text-gold-accent font-bold" : "text-muted-brown hover:text-coffee"}`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] bg-coffee/5 px-2 py-0.5 rounded-full">{c._count.products}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter Tags */}
            <div>
              <h1 className="font-black text-coffee uppercase tracking-widest text-xs mb-4">Trending Tags</h1>
              <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                  <Link 
                    key={t.id} 
                    href={`/?tag=${t.slug}#products`}
                    className={`text-[10px] px-3 py-1.5 rounded-full border font-bold transition-all ${
                      tagFilter === t.slug 
                      ? "bg-gold-accent text-white border-gold-accent" 
                      : "bg-white border-gray-200 text-gray-500 hover:border-gold-accent hover:text-gold-accent"
                    }`}
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* --- MAIN GRID (Kanan) --- */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                 {query ? (
                    <h1 className="text-2xl font-black text-coffee">Hasil pencarian: "{query}"</h1>
                 ) : catFilter ? (
                    <h1 className="text-2xl font-black text-coffee">Kategori: {categories.find(c => c.slug === catFilter)?.name}</h1>
                 ) : tagFilter ? (
                    <h1 className="text-2xl font-black text-coffee">Tag: #{tags.find(t => t.slug === tagFilter)?.name}</h1>
                 ) : (
                    <h1 className="text-2xl font-black text-coffee tracking-tighter uppercase">Rekomendasi Terbaru</h1>
                 )}
                 
                 {/* Tombol Clear Filter */}
                 {isFiltering && (
                   <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-red-500 mt-2 hover:underline">
                     <X className="w-3 h-3" /> Reset Filter
                   </Link>
                 )}
              </div>
              <p className="text-sm font-bold text-muted-brown">{products.length} Produk</p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      // ✅ UPDATE: Gunakan minPrice & storeCount (bukan price/shopeeLink lagi)
                      minPrice: product.minPrice ? Number(product.minPrice) : 0,
                      category: product.category?.name || "Uncategorized", 
                      image: product.images[0] || "/placeholder.jpg",
                      storeCount: product._count.links 
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Tidak ada produk yang ditemukan.</p>
                <Link href="/" className="text-gold-accent text-sm font-bold mt-2 inline-block hover:underline">Lihat Semua Produk</Link>
              </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
}