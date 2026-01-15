import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/components/ImageCarousel";
import ProductCard from "@/components/ProductCard";
import { CheckCircle2, AlertCircle, ChevronLeft, Sparkles, Store, ExternalLink, MapPin, BadgeCheck, Box } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MarketplaceType } from "@prisma/client";
import FloatingCTA from "@/components/FloatingCTA";
import AffiliateButton from "@/components/AffiliateButton";

// --- Utility Functions ---
const formatRupiah = (num: number | null) => {
  if (num === null || num === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const getList = (text: string | null) => {
  if (!text) return [];
  return text.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
};

// --- 1. Metadata ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    select: { name: true, description: true, images: true }
  });

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${product.name} - Harga Termurah & Review`,
    description: product.description?.slice(0, 160) || `Cek harga ${product.name} terbaru.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}
// Komponen Schema untuk diletakkan di dalam atau di atas return utama
const ProductSchema = ({ product }: { product: any }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `Cek harga terbaik untuk ${product.name}`,
    "image": product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"],
    "brand": {
      "@type": "Brand",
      "name": "Jagopilih" // Sesuaikan dengan nama brand/situs Anda
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "IDR",
      "lowPrice": product.minPrice || 0,
      "highPrice": product.maxPrice || 0,
      "offerCount": product.links?.length || 0,
      "offers": product.links?.map((link: any) => ({
        "@type": "Offer",
        "url": link.affiliateUrl || link.originalUrl,
        "price": link.currentPrice,
        "priceCurrency": "IDR",
        "seller": {
          "@type": "Organization",
          "name": link.storeName
        },
        "availability": link.isStockReady 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock"
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// --- 2. Main Page Component ---
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  // FETCH DATA DENGAN RELASI LINKS
  const rawProduct = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
      links: {
        orderBy: { currentPrice: 'asc' }
      }
    },
  });

  if (!rawProduct) notFound();

  // SERIALISASI DATA (Decimal -> Number)
  const product = {
    ...rawProduct,
    minPrice: rawProduct.minPrice ? Number(rawProduct.minPrice) : 0,
    maxPrice: rawProduct.maxPrice ? Number(rawProduct.maxPrice) : 0,
    links: rawProduct.links.map(link => ({
      ...link,
      currentPrice: Number(link.currentPrice)
    }))
  };

  // FETCH RELATED PRODUCTS
  const relatedRaw = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { 
      category: true,
      _count: { select: { links: true } } 
    },
    take: 3,
  });

  const relatedProducts = relatedRaw.map(p => ({
    ...p,
    minPrice: p.minPrice ? Number(p.minPrice) : 0,
    storeCount: p._count.links
  }));

  // --- Helper untuk Style Tombol Dinamis ---
  const getMarketplaceStyle = (marketplace: MarketplaceType, isReady: boolean) => {
    if (!isReady) return 'bg-gray-100 text-gray-400 cursor-not-allowed';

    const baseStyle = "text-white hover:-translate-y-0.5 shadow-sm";

    switch (marketplace) {
      case 'SHOPEE':
        return `bg-[#EE4D2D] hover:bg-[#d73211] ${baseStyle}`; // Shopee Orange
      case 'TOKOPEDIA':
        return `bg-[#03AC0E] hover:bg-[#028a0b] ${baseStyle}`; // Tokopedia Green (Pakai text putih agar kontras)
      case 'TIKTOK':
        return `bg-black hover:bg-gray-800 ${baseStyle}`; // TikTok Black
      case 'WHATSAPP_LOKAL':
        return `bg-[#25D366] hover:bg-[#1da851] ${baseStyle}`; // WA Green
      default:
        return `bg-coffee hover:bg-gold-accent ${baseStyle}`; // Default Theme
    }
  };

  // 3. Logic Mencari "Best Deal" (Verified + Termurah)
  // Filter hanya yang Verified & Stock Ready
  const verifiedLinks = product.links.filter(l => l.isVerified && l.isStockReady);

  // Jika ada yang verified, urutkan harga termurah.
  // Jika TIDAK ADA yang verified, fallback ke harga termurah dari toko biasa (opsional, tergantung kebijakan Anda)
  // Sesuai request Anda: "Hanya links toko yang terverifikasi", maka kita pakai verifiedLinks.
  const bestDealLink = verifiedLinks.length > 0 
    ? verifiedLinks.sort((a, b) => a.currentPrice - b.currentPrice)[0] 
    : null; // Jika null, Floating CTA tidak akan muncul

  const bestDealData = bestDealLink ? {
    marketplace: bestDealLink.marketplace,
    storeName: bestDealLink.storeName,
    url: bestDealLink.affiliateUrl || bestDealLink.originalUrl,
    price: bestDealLink.currentPrice
  } : null;

  return (
    // ✅ UPDATE POINT 1 & 2: Tambah padding-top (pt-28) untuk navbar fix, 
    // relative & overflow-hidden untuk background pattern.
    <>
    <ProductSchema product={product} />
    <div className="min-h-screen bg-[#FDFCF8] font-sans pb-24 relative pt-28">
      
      {/* ✅ UPDATE POINT 2: Background Motif Pattern (Sama seperti Hero.tsx) */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none mix-blend-multiply"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
        }}
      />

      {/* 3. BACKGROUND DECOR (Blobs & Grid) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* Blob Gold - Opacity dikurangi biar lebih soft */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob" />
        {/* Blob Coffee - Opacity dikurangi biar lebih soft */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-coffee/5 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000" />
        
        {/* Grid Pattern Halus */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-coffee transition-colors bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KOLOM KIRI: GAMBAR */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
               <ImageCarousel images={product.images} productName={product.name} />
            </div>
          </div>

          {/* KOLOM KANAN: INFO & HARGA */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header Info */}
            <div className="space-y-4 border-b border-gray-200/50 pb-8">
              {product.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-gold-accent/10 text-gold-accent text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-coffee leading-tight">
                {product.name}
              </h1>
              
              {/* Harga Utama */}
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Harga Mulai Dari</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gold-accent">
                    {formatRupiah(product.minPrice)}
                  </span>
                  {product.maxPrice > product.minPrice && (
                    <span className="text-lg text-gray-400 font-medium">
                      - {formatRupiah(product.maxPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DAFTAR PERBANDINGAN TOKO */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-coffee flex items-center gap-2">
                  <Store className="w-5 h-5 text-gold-accent" />
                  Pilihan Toko ({product.links.length})
                </h3>
                <span className="text-xs text-gray-500">Diurutkan dari termurah</span>
              </div>

              <div className="divide-y divide-gray-100">
                {product.links.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    Belum ada data toko untuk produk ini.
                  </div>
                ) : (
                  product.links.map((link) => (
                    <div key={link.id} className="p-4 sm:p-5 hover:bg-yellow-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Kiri: Info Toko */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800 text-lg">{link.storeName}</span>
                          {link.isVerified && (
                             <BadgeCheck className="w-5 h-5 text-blue-500" fill="currentColor" color="white" />
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                           {/* Badge Marketplace */}
                           <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-600 tracking-wider">
                            {link.marketplace.replace("_", " ")}
                          </span>
                          {link.region && (
                            <span className="flex items-center gap-1 text-coffee font-medium bg-orange-100/50 px-2 py-1 rounded-md">
                              <MapPin className="w-3 h-3" /> {link.region}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 font-medium px-2 py-1 rounded-md ${link.isStockReady ? 'bg-green-100/50 text-green-700' : 'bg-red-100/50 text-red-600'}`}>
                            <Box className="w-3 h-3" /> {link.isStockReady ? 'Stok Ready' : 'Stok Habis'}
                          </span>
                        </div>
                      </div>

                      {/* Kanan: Harga & Tombol */}
                      <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                        <div className="text-left sm:text-right leading-tight">
                          <div className="font-black text-xl text-gold-accent font-sans">
                            {formatRupiah(link.currentPrice)}
                          </div>
                          {link.currentPrice > product.minPrice && (
                            <div className="text-xs text-red-400 font-medium">
                              Lebih mahal {formatRupiah(link.currentPrice - product.minPrice)}
                            </div>
                          )}
                        </div>
                        {/* ✅ UPDATE POINT 3: Tombol Dinamis */}
                        <AffiliateButton 
                            url={link.affiliateUrl || link.originalUrl}
                            // Kita kirim Style Warna dari Server ke Client Component
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${getMarketplaceStyle(link.marketplace, link.isStockReady)}`}
                          />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Deskripsi & Review */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm h-fit">
                <h3 className="font-bold text-lg text-coffee border-b border-gray-100 pb-3">Deskripsi Produk</h3>
                <div className="prose prose-sm prose-stone text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || "Belum ada deskripsi."}
                </div>
              </div>

              <div className="space-y-6">
                 {/* Pros */}
                 {product.pros && (
                   <div className="bg-green-50/80 backdrop-blur-sm p-6 rounded-2xl border border-green-100/50 shadow-sm">
                     <h4 className="font-bold text-green-800 flex items-center gap-2 mb-4">
                       <CheckCircle2 className="w-5 h-5" /> Kelebihan
                     </h4>
                     <ul className="space-y-3">
                       {getList(product.pros).map((item, i) => (
                         <li key={i} className="flex items-start gap-3 text-sm text-green-800/80 font-medium">
                           <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 shadow-sm" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}

                 {/* Cons */}
                 {product.cons && (
                   <div className="bg-red-50/80 backdrop-blur-sm p-6 rounded-2xl border border-red-100/50 shadow-sm">
                     <h4 className="font-bold text-red-800 flex items-center gap-2 mb-4">
                       <AlertCircle className="w-5 h-5" /> Kekurangan
                     </h4>
                     <ul className="space-y-3">
                       {getList(product.cons).map((item, i) => (
                         <li key={i} className="flex items-start gap-3 text-sm text-red-800/80 font-medium">
                           <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 shadow-sm" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="pt-12 border-t border-gray-200/50 mt-12">
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="w-6 h-6 text-gold-accent" />
                  <h3 className="font-black text-2xl text-coffee">Produk Serupa</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((related) => (
                    <ProductCard
                      key={related.id}
                      product={{
                        id: related.id,
                        name: related.name,
                        slug: related.slug,
                        minPrice: related.minPrice,
                        category: related.category?.name || "Product",
                        image: related.images[0] || "/placeholder.jpg",
                        storeCount: related.storeCount
                      }}
                    />
                  ))}
                </div>
                {/* 4. BOTTOM FADE SEPARATOR (Gradasi Halus ke bawah) */}
                {/* Ini yang membuat Hero menyatu lembut dengan list produk */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-bg to-transparent z-10 pointer-events-none" />

              </section>
            )}

          </div>
        </div>
      </div>
      <FloatingCTA bestDeal={bestDealData} />
    </div>
    </>
  );
}