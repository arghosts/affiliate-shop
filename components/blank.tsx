import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, User, ArrowRight, ShoppingBag } from "lucide-react"; 
import { Metadata } from "next";
import React from "react"; 
import ShareWidget from "@/components/ShareWidget"; 

// --- 1. FIXED RENDER BLOCK (Strict & Clean) ---
const renderBlock = (block: any) => {
  // Guard clause: jika data tidak valid, skip render
  if (!block || !block.data) return null;

  switch (block.type) {
    case "header":
      const level = block.data.level || 2;
      const HeadingTag = `h${level}` as React.ElementType;
      // Style dinamis berdasarkan level header
      const headingClass = level === 2 
        ? "text-3xl font-bold mt-10 mb-6 text-coffee leading-tight" 
        : "text-2xl font-semibold mt-8 mb-4 text-gray-800 leading-snug";
      
      return (
        <HeadingTag key={block.id} className={headingClass}>
          {/* Gunakan dangerouslySetInnerHTML jika header mengandung mark/bold */}
          <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
        </HeadingTag>
      );

    case "paragraph":
      return (
        <p 
          key={block.id} 
          className="mb-6 text-gray-700 leading-loose text-lg"
          // Render HTML langsung di P, jangan bungkus span lagi (cleaner DOM)
          dangerouslySetInnerHTML={{ __html: block.data.text }} 
        />
      );

    case "list":
      const ListTag = block.data.style === "ordered" ? "ol" : "ul";
      const listClass = block.data.style === "ordered" ? "list-decimal" : "list-disc";
      
      // Safety check untuk items
      if (!Array.isArray(block.data.items)) return null;

      return (
        <ListTag key={block.id} className={`${listClass} mb-6 ml-6 space-y-2 text-gray-700 text-lg leading-relaxed`}>
          {block.data.items.map((item: string, i: number) => (
             <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ListTag>
      );
      
    case "image":
      const imageUrl = block.data.file?.url;
      if (!imageUrl) return null;

      return (
        <figure key={block.id} className="my-10">
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
            <img 
              src={imageUrl} 
              alt={block.data.caption || "Blog Image"} 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    // Tambahkan case lain jika perlu (quote, table, dll)
    
    default:
      return null;
  }
};

// --- METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
    select: { title: true, thumbnail: true }
  });

  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: post.title,
    openGraph: {
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

// --- MAIN COMPONENT ---
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) notFound();

  // Parsing JSON Content (Safe Mode)
  let contentBlocks = [];
  try {
    const rawContent = post.content;
    // Cek apakah content string atau object sebelum parse
    const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
    
    // Pastikan blocks ada dan berbentuk array
    contentBlocks = Array.isArray(parsed?.blocks) ? parsed.blocks : [];
    
  } catch (e) {
    console.error("Error parsing content:", e);
    // Fallback content biar page tidak error total
    contentBlocks = []; 
  }

  const date = new Date(post.createdAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans pb-24 pt-28 relative">

      {/* TEXTURE NOISE */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none mix-blend-multiply"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
        }}
      />
      
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-coffee/5 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-coffee transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KOLOM KIRI: KONTEN ARTIKEL */}
          <article className="lg:col-span-8">
            <div className="mb-8">
               <h1 className="text-3xl sm:text-4xl font-black text-coffee leading-tight mb-4">
                 {post.title}
               </h1>
               <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-accent" /> {date}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-accent" /> Admin
                  </span>
               </div>
            </div>

            {post.thumbnail && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
                <img src={post.thumbnail} alt={post.title} className="object-cover w-full h-full" />
              </div>
            )}

            {/* RENDERER DI SINI */}
            <div className="prose prose-lg prose-stone max-w-none">
              {contentBlocks.length > 0 ? (
                contentBlocks.map((block: any) => renderBlock(block))
              ) : (
                <p className="text-gray-400 italic">Konten sedang dimuat atau kosong...</p>
              )}
            </div>
            
            {/* CTA Mobile */}
            {post.referenceLink && (
               <div className="mt-12 p-6 bg-gradient-to-r from-coffee to-gray-800 rounded-2xl text-white shadow-xl lg:hidden">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gold-accent" /> Tertarik Produk Ini?
                  </h3>
                  <p className="text-white/80 mb-6 text-sm">
                    Cek spesifikasi lengkap, perbandingan harga termurah, dan toko terpercaya.
                  </p>
                  <Link 
                    href={post.referenceLink}
                    className="block w-full text-center bg-gold-accent text-white font-bold py-3.5 rounded-xl hover:bg-white hover:text-coffee transition-all"
                  >
                    Cek Harga Terbaru
                  </Link>
               </div>
            )}
          </article>

          {/* KOLOM KANAN: SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              
              {/* CTA Desktop */}
              {post.referenceLink && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden lg:block">
                   <div className="mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Rekomendasi
                      </span>
                   </div>
                   <h3 className="font-bold text-coffee text-xl mb-2">Produk Terkait</h3>
                   <p className="text-sm text-gray-500 mb-6">
                     Artikel ini membahas produk yang tersedia di katalog kami. Cek harga terbaik sekarang.
                   </p>
                   
                   <Link 
                     href={post.referenceLink}
                     className="w-full flex items-center justify-center gap-2 bg-gold-accent text-white font-bold py-3 rounded-xl hover:bg-coffee transition-all shadow-lg shadow-gold-accent/20 group"
                   >
                     Cek Harga & Toko <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                   </Link>
                </div>
              )}

              <ShareWidget title={post.title} slug={post.slug} />

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}