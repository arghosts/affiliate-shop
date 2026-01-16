import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, User, ArrowRight, ShoppingBag } from "lucide-react"; 
import { Metadata } from "next";
import React from "react"; 
import ShareWidget from "@/components/ShareWidget";
import Image from "next/image";

// --- HELPER: Render Block Editor.js (ROBUST VERSION) ---
const renderBlock = (block: any) => {
  // 1. Safety Guard
  if (!block || !block.data) return null;

  switch (block.type) {
    case "header":
      const level = block.data.level || 2;
      const HeadingTag = `h${level}` as React.ElementType;
      const headingClass = level === 2 
        ? "text-3xl font-bold mt-10 mb-6 text-coffee leading-tight" 
        : "text-2xl font-semibold mt-8 mb-4 text-gray-800 leading-snug";
      
      return (
        <HeadingTag key={block.id} className={headingClass}>
          <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
        </HeadingTag>
      );

    case "paragraph":
      return (
        <p 
          key={block.id} 
          className="mb-6 text-gray-700 leading-loose text-lg"
          dangerouslySetInnerHTML={{ __html: block.data.text }} 
        />
      );

    case "list":
      const ListTag = block.data.style === "ordered" ? "ol" : "ul";
      const listClass = block.data.style === "ordered" ? "list-decimal" : "list-disc";
      const items = block.data.items || [];

      return (
        <ListTag key={block.id} className={`${listClass} mb-6 ml-8 space-y-2 text-gray-700 text-lg leading-relaxed`}>
          {items.map((item: any, i: number) => {
            // 👇 LOGIKA PERBAIKAN [object Object] 👇
            let content = "";
            
            if (typeof item === "string") {
              // Jika data bersih (Array of strings)
              content = item;
            } else if (typeof item === "object" && item !== null) {
              // Jika data kotor (Array of objects), ambil properti 'content' atau 'text'
              // Ini sering terjadi kalau pakai Nested List atau bug parsing
              content = item.content || item.text || item.value || JSON.stringify(item); 
            }

            return (
              <li key={i} dangerouslySetInnerHTML={{ __html: content }} />
            );
          })}
        </ListTag>
      );
      
    case "image":
      const imageUrl = block.data.file?.url;
      if (!imageUrl) return null;
      
      return (
        <figure key={block.id} className="my-10">
          {/* Wrapper dengan aspect-video (16:9) agar browser sudah 
            menyiapkan ruang sebelum gambar muncul (Zero CLS) 
          */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
            <Image
              src={imageUrl}
              alt={block.data.caption || "Gambar konten Jagopilih"}
              fill
              className="object-cover"
              // Jangan gunakan priority di sini kecuali ini gambar pertama di artikel
              // Browser akan melakukan lazy load secara otomatis
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3 italic font-medium">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );
      case "table":
      const tableData = block.data;
      const rows = tableData.content || [];
      const withHeadings = tableData.withHeadings || false; // Cek apakah baris pertama adalah header

      if (!rows.length) return null;

      return (
        <div key={block.id} className="my-8 w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left text-sm text-gray-700 border-collapse">
            
            {/* RENDER HEADER (Jika withHeadings: true) */}
            {withHeadings && rows.length > 0 && (
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {rows[0].map((cell: string, index: number) => (
                    <th 
                      key={index} 
                      className="px-6 py-4 font-bold text-coffee uppercase tracking-wider text-xs"
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              </thead>
            )}

            {/* RENDER BODY */}
            <tbody className="divide-y divide-gray-100 bg-white">
              {/* Jika withHeadings true, kita skip baris pertama (slice 1). Jika false, render semua. */}
              {(withHeadings ? rows.slice(1) : rows).map((row: string[], rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                  {row.map((cell: string, cellIndex: number) => (
                    <td 
                      key={cellIndex} 
                      className="px-6 py-4 whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
    // 👇 DEBUGGER: Kalau ada block aneh, dia akan muncul sebagai kode merah
    default:
      if (process.env.NODE_ENV === 'development') {
         return (
           <div key={block.id} className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-mono my-4">
             <strong>Unknown Block: {block.type}</strong>
             <pre>{JSON.stringify(block.data, null, 2)}</pre>
           </div>
         );
      }
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

  // Parsing JSON Content
  let contentBlocks = [];
  try {
    const parsed = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
    contentBlocks = parsed?.blocks || [];
  } catch (e) {
    console.error("Error parsing content:", e);
  }

  const date = new Date(post.createdAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    
    <div className="min-h-screen bg-[#FDFCF8] font-sans pb-24 pt-28">

      {/* 2. TEXTURE NOISE (Efek Kertas Premium) */}
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  // ✅ KRUSIAL: Beritahu browser ini adalah LCP agar dimuat paling awal
                  priority 
                  // ✅ KRUSIAL: Mencegah browser download gambar ukuran raksasa di layar HP kecil
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                />
              </div>
            )}

            <div className="prose prose-lg prose-stone max-w-none">
              {contentBlocks.map((block: any) => renderBlock(block))}
            </div>
            
            {/* CTA Mobile (Tetap ada di bawah artikel) */}
            {post.referenceLink && (
               <div className="mt-12 p-6 bg-gradient-to-r from-coffee to-gray-800 rounded-2xl text-white shadow-xl lg:hidden">
                  <h1 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gold-accent" /> Tertarik Produk Ini?
                  </h1>
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
            
            {/* ✅ WRAPPER STICKY: Membungkus Rekomendasi & Share */}
            {/* 'lg:sticky' agar hanya lengket di desktop, 'top-28' untuk jarak dari atas */}
            <div className="space-y-8 lg:sticky lg:top-28">
              
              {/* CTA Desktop */}
              {post.referenceLink && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden lg:block">
                   <div className="mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Rekomendasi
                      </span>
                   </div>
                   <h1 className="font-bold text-coffee text-xl mb-2">Produk Terkait</h1>
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

              {/* Share Widget (Ikut sticky karena di dalam wrapper ini) */}
              <ShareWidget title={post.title} slug={post.slug} />

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}