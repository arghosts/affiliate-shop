import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/components/ImageCarousel";
import FloatingCTA from "@/components/FloatingCTA"; 
import ProductCard from "@/components/ProductCard"; // ✅ Import Component Card
import { ShoppingBag, CheckCircle2, AlertCircle, ChevronLeft, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

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

// --- 1. Generate Metadata ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    select: { name: true, description: true, images: true }
  });

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${product.name} - Review & Spesifikasi`,
    description: product.description ? product.description.substring(0, 160) : `Beli ${product.name} harga terbaik.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    }
  };
}

// --- 2. Main Page Component ---
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  // A. Fetch Produk Utama
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true } // Include category untuk breadcrumb & related logic
  });

  if (!product) {
    notFound();
  }

  // B. Fetch Related Products (Produk Serupa)
  // Logic: Ambil produk dengan categoryId sama, tapi ID-nya bukan produk yang sedang dibuka
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id } // Exclude current product
    },
    take: 3, // Ambil 3 saja
    orderBy: { createdAt: 'desc' }, // Yang terbaru
    include: { category: true }
  });

  // Prepare Data Pros & Cons
  const prosList = getList(product.pros);
  const consList = getList(product.cons);

  return (
    <div className="bg-warm-bg min-h-screen pb-32">
      
      {/* HEADER / BREADCRUMB */}
      <div className="bg-white border-b border-coffee/5 pt-28 pb-6 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-brown hover:text-gold-accent mb-2">
            <ChevronLeft size={16} /> Kembali
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-accent">
             <span>{product.category?.name || "Gadget"}</span>
             <span>•</span>
             <span>Review</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-coffee mt-2 leading-tight">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* LEFT COL: IMAGE CAROUSEL */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
              <ImageCarousel images={product.images} productName={product.name} />
            </div>
          </div>

          {/* RIGHT COL: CONTENT */}
          <div className="lg:col-span-7">
            
            {/* Price Card */}
            <div className="bg-white p-6 rounded-2xl border border-coffee/5 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">Estimasi Harga</p>
                <p className="text-3xl font-black text-coffee">{formatRupiah(Number(product.price))}</p>
              </div>
              
              {/* Desktop Actions (Hidden di Mobile karena ada FloatingCTA) */}
              <div className="hidden md:flex gap-3">
                {product.tokpedLink && (
                  <a href={product.tokpedLink} target="_blank" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200">
                    Tokopedia
                  </a>
                )}
                {product.shopeeLink && (
                  <a href={product.shopeeLink} target="_blank" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-200">
                    Shopee
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-brown prose-lg max-w-none mb-10">
              <h3 className="font-bold text-coffee text-xl mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-accent" />
                Overview
              </h3>
              <p className="whitespace-pre-line text-gray-600 leading-relaxed text-base">
                {product.description}
              </p>
            </div>

            {/* PROS & CONS SECTION */}
            {(prosList.length > 0 || consList.length > 0) && (
              <div className="grid grid-cols-1 gap-6 mb-12">
                
                {/* PROS */}
                {prosList.length > 0 && (
                  <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs">Why We Love It</h4>
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
                )}

                {/* CONS */}
                {consList.length > 0 && (
                  <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 shadow-sm">
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
                )}
              </div>
            )}
            
            {/* --- SEPARATOR --- */}
            <hr className="border-coffee/10 my-12" />

            {/* --- RELATED PRODUCTS SECTION (BARU) --- */}
            {relatedProducts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-coffee uppercase tracking-wide">
                      Mungkin Kamu Suka
                    </h3>
                    <p className="text-sm text-muted-brown mt-1">
                      Pilihan lain dari kategori <span className="font-bold text-gold-accent">{product.category?.name}</span>
                    </p>
                  </div>
                  {/* Link Lihat Semua (Opsional) */}
                  <Link 
                    href={`/?cat=${product.category?.slug}`} 
                    className="hidden sm:inline-flex items-center text-xs font-bold text-muted-brown hover:text-gold-accent transition-colors"
                  >
                    Lihat Lainnya <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((related) => (
                    // REUSE KOMPONEN PRODUCT CARD
                    <ProductCard
                      key={related.id}
                      product={{
                        id: related.id,
                        name: related.name,
                        slug: related.slug,
                        price: Number(related.price),
                        category: related.category?.name || "Product",
                        image: related.images[0] || "/placeholder.jpg",
                        shopeeLink: related.shopeeLink,
                        tokpedLink: related.tokpedLink
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
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

// Icon Helper Kecil
function ArrowRightIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}