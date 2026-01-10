import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/components/ImageCarousel";
import FloatingCTA from "@/components/FloatingCTA"; 
import { ShoppingBag, CheckCircle2, AlertCircle, ChevronLeft, Store } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

// --- Utility Functions (Diluar Komponen) ---
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

// --- 1. Generate Metadata untuk SEO ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    select: { name: true, description: true, images: true }
  });

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${product.name} - Review & Spesifikasi`,
    description: product.description?.substring(0, 160) || `Detail lengkap tentang ${product.name}`,
    openGraph: {
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { 
      category: true 
    },
  });

  if (!product) notFound();

  const prosList = getList(product.pros);
  const consList = getList(product.cons);
  
  // Placeholder image jika array kosong
  const mainImage = product.images.length > 0 ? product.images[0] : "https://placehold.co/600x600?text=No+Image";

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: mainImage,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.category?.name || "Generic", 
    },
    offers: {
      "@type": "Offer",
      url: product.shopeeLink || product.tokpedLink || "https://jagopilih.vercel.app",
      priceCurrency: "IDR",
      price: Number(product.price), 
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-warm-bg pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navbar/Header Spacing adjustment if needed */}
      <div className="pt-24 lg:pt-28"></div>

      {/* Breadcrumb / Back Button */}
      <div className="container mx-auto px-6 mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-brown/70 hover:text-gold-accent transition-colors group"
        >
          <div className="p-1 rounded-full bg-white group-hover:bg-gold-accent group-hover:text-white transition-all">
             <ChevronLeft className="w-4 h-4" />
          </div>
          Kembali ke Katalog
        </Link>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: CAROUSEL (5 Columns) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] shadow-sm border border-surface lg:sticky lg:top-28">
             <ImageCarousel images={product.images.length > 0 ? product.images : [mainImage]} productName={product.name} />
          </div>

          {/* RIGHT: DETAIL INFO (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col pt-2">
            {/* Tag Kategori */}
            <span className="text-coffee/60 font-black text-[10px] tracking-[0.2em] uppercase mb-4 px-3 py-1.5 bg-surface w-fit rounded-lg border border-coffee/5">
              {product.category?.name || "REVIEW PRODUK"}
            </span>

            {/* Judul */}
            <h1 className="text-3xl md:text-5xl font-black text-coffee tracking-tight leading-[1.1] mb-6">
              {product.name}
            </h1>

            {/* Harga */}
            <div className="mb-8 p-4 bg-white/50 rounded-2xl border border-gold-accent/10 inline-block w-full sm:w-auto">
                <p className="text-sm text-muted-brown font-semibold mb-1">Harga perkiraan saat ini:</p>
                <p className="text-3xl md:text-4xl font-black text-gold-accent tracking-tight">
                {formatRupiah(Number(product.price))}
                </p>
            </div>

            {/* Deskripsi */}
            <div className="prose prose-neutral prose-lg max-w-none mb-10">
               <p className="text-muted-brown leading-relaxed whitespace-pre-line">
                 {product.description}
               </p>
            </div>

            {/* ACTION BUTTONS (Desktop View - Mobile handled by FloatingCTA) */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4 mb-12 border-t border-surface pt-8">
              {product.shopeeLink && (
                <a
                  href={product.shopeeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#EE4D2D] text-white py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#d03e1f] hover:-translate-y-1 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Beli di Shopee
                </a>
              )}
              
              {product.tokpedLink && (
                 <a
                 href={product.tokpedLink}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex-1 bg-[#42b549] text-white py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#3aa341] hover:-translate-y-1 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 uppercase tracking-wider"
               >
                 <Store className="w-5 h-5" />
                 Beli di Tokopedia
               </a>
              )}
              
              {!product.shopeeLink && !product.tokpedLink && (
                 <button disabled className="flex-1 bg-gray-200 text-gray-400 py-4 px-6 rounded-xl font-bold text-sm cursor-not-allowed uppercase tracking-wider">
                    Stok Habis / Link Kosong
                 </button>
              )}
            </div>
          </div>
        </div>

        {/* ANALISIS PROS & CONS */}
        {(prosList.length > 0 || consList.length > 0) && (
            <div className="mt-20 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-[1px] bg-coffee/10 w-12 md:w-24"></div>
                <h2 className="text-2xl font-black text-coffee text-center uppercase tracking-widest">
                Kelebihan & <span className="text-gold-accent">Kekurangan</span>
                </h2>
                <div className="h-[1px] bg-coffee/10 w-12 md:w-24"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PROS CARD */}
                <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs">Why We Like It</h4>
                </div>
                <ul className="space-y-4">
                    {prosList.map((item, i) => (
                    <li key={i} className="text-sm text-emerald-900/80 font-bold flex items-start gap-3 leading-relaxed">
                        <span className="text-emerald-500 mt-0.5">•</span> 
                        {item}
                    </li>
                    ))}
                </ul>
                </div>

                {/* CONS CARD */}
                <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 text-red-500 rounded-full">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-red-800 uppercase tracking-widest text-xs">Points to Consider</h4>
                </div>
                <ul className="space-y-4">
                    {consList.map((item, i) => (
                    <li key={i} className="text-sm text-red-900/80 font-bold flex items-start gap-3 leading-relaxed">
                        <span className="text-red-400 mt-0.5">•</span>
                        {item}
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            </div>
        )}

      </div>
      
      {/* Floating CTA for Mobile/Tablet */}
      <FloatingCTA 
        price={Number(product.price)} 
        shopeeLink={product.shopeeLink} 
        tokpedLink={product.tokpedLink} 
      />
    </div>
  );
}