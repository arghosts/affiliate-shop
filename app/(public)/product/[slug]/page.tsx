import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/components/ImageCarousel"; 
import { ShoppingBag, CheckCircle2, AlertCircle, Youtube, ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {  images: true,
                category: true 
              },
            });

  if (!product) notFound();

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getList = (text: string | null) => {
    if (!text) return [];
    return text.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
  };

  const prosList = getList(product.pros);
  const consList = getList(product.cons);

  return (
    // Background Warm White sesuai Global CSS
    <div className="min-h-screen bg-warm-bg pb-20">
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-brown hover:text-gold-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* CAROUSEL CONTAINER: Pakai bg-surface (Cream) */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-surface">
             <ImageCarousel images={product.images} productName={product.name} />
          </div>

          {/* DETAIL INFO */}
          <div className="flex flex-col pt-4">
            {/* Tag Kategori: Surface BG + Coffee Text */}
            <span className="text-coffee font-black text-[10px] tracking-[0.2em] uppercase mb-4 px-3 py-1 bg-surface w-fit rounded-sm">
              {product.category?.name || "GADGET REVIEW"}
            </span>

            {/* Judul: Coffee (Espresso) */}
            <h1 className="text-4xl md:text-5xl font-black text-coffee tracking-tighter leading-[0.9] mb-6">
              {product.name}
            </h1>

            {/* Harga: Gold Accent (Teal) */}
            <p className="text-3xl font-black text-gold-accent mb-8 flex items-baseline gap-2">
              {formatRupiah(Number(product.price))}
              <span className="text-sm font-bold text-muted-brown/50">/ estimasi</span>
            </p>

            {/* Description: Muted Brown */}
            <div className="prose prose-neutral mb-10">
               <p className="text-lg text-muted-brown leading-relaxed font-medium">
                 {product.description}
               </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              {product.shopeeLink ? (
                <a
                  href={product.shopeeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#EE4D2D] text-white py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#d03e1f] transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Beli di Shopee
                </a>
              ) : null}
              
              <button className="flex-1 bg-surface text-coffee border border-surface py-4 px-6 rounded-xl font-bold text-sm hover:bg-gold-accent hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                <Youtube className="w-5 h-5" />
                Review Video
              </button>
            </div>
          </div>
        </div>

        {/* ANALISIS PROS & CONS */}
        <div className="mt-24 max-w-5xl mx-auto pt-16 border-t border-surface">
          <h2 className="text-2xl font-black text-coffee text-center mb-12 uppercase tracking-widest">
            In-Depth <span className="text-gold-accent">Analysis</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PROS CARD: Surface BG */}
            <div className="bg-surface/30 p-8 rounded-2xl border border-surface shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-full shadow-sm">
                   <CheckCircle2 className="text-gold-accent w-5 h-5" />
                </div>
                <h4 className="font-black text-coffee uppercase tracking-widest text-xs">Pros / Kelebihan</h4>
              </div>
              <ul className="space-y-4">
                {prosList.length > 0 ? prosList.map((item, i) => (
                  <li key={i} className="text-sm text-muted-brown font-bold flex items-start gap-3">
                    <span className="text-gold-accent">•</span> 
                    {item}
                  </li>
                )) : <p className="text-sm text-gray-400 italic">Data belum tersedia</p>}
              </ul>
            </div>

            {/* CONS CARD: Surface BG */}
            <div className="bg-surface/30 p-8 rounded-2xl border border-surface shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-full shadow-sm">
                   <AlertCircle className="text-red-500 w-5 h-5" />
                </div>
                <h4 className="font-black text-coffee uppercase tracking-widest text-xs">Cons / Kekurangan</h4>
              </div>
              <ul className="space-y-4">
                {consList.length > 0 ? consList.map((item, i) => (
                  <li key={i} className="text-sm text-muted-brown font-bold flex items-start gap-3">
                    <span className="text-red-500">•</span>
                    {item}
                  </li>
                )) : <p className="text-sm text-gray-400 italic">Data belum tersedia</p>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}