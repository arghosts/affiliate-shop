import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, User, ArrowRight } from "lucide-react"; // Import icon yang dipakai saja
import { Metadata } from "next";
import React from "react"; 
import ShareWidget from "@/components/ShareWidget"; // Import komponen baru

// --- HELPER 1: Render Block Editor.js ---
const renderBlock = (block: any) => {
  switch (block.type) {
    case "header":
      // Variable diganti 'HeadingTag' biar aman
      const HeadingTag = `h${block.data.level}` as React.ElementType;
      
      const size = block.data.level === 2 
        ? "text-2xl font-bold mt-8 mb-4 text-gray-900" 
        : "text-xl font-semibold mt-6 mb-3 text-gray-800";
        
      return <HeadingTag key={block.id} className={size}>{block.data.text}</HeadingTag>;

    case "paragraph":
      return (
        <p key={block.id} className="mb-4 text-gray-700 leading-relaxed text-lg">
          <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
        </p>
      );

    case "list":
    case "checklist":
      const isOrdered = block.data.style === "ordered";
      const ListTag = isOrdered ? "ol" : "ul";
      const listStyle = isOrdered ? "list-decimal" : "list-disc";
      
      return (
        <ListTag key={block.id} className={`${listStyle} list-inside mb-6 pl-4 space-y-2 text-gray-700 text-lg`}>
          {block.data.items.map((item: any, i: number) => {
            // 🔍 SYSTEMIZER CHECK: 
            // If item is string -> use it directly
            // If item is object -> extract 'content' or 'text' property
            const content = typeof item === 'string' 
              ? item 
              : item.content || item.text || ""; 

            return (
              <li key={i} dangerouslySetInnerHTML={{ __html: content }} />
            );
          })}
        </ListTag>
      );
      // ✅ NEW: Menangani Gambar (Image Tool)
    case "image":
      return (
        <figure key={block.id} className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200">
            {/* Menggunakan tag img standar agar kompatibel dengan berbagai sumber URL */}
            <img 
              src={block.data.file.url} 
              alt={block.data.caption || "Gambar Artikel"} 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
              {/* Render caption dengan HTML safe (untuk link source dsb) */}
              <span dangerouslySetInnerHTML={{ __html: block.data.caption }} />
            </figcaption>
          )}
        </figure>
      );

    // ✅ NEW: Menangani Embed (YouTube, Twitter, dll)
    case "embed":
      return (
        <figure key={block.id} className="my-8 w-full flex flex-col items-center">
          <div className="w-full relative pt-[56.25%] bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
             {/* Wrapper pt-[56.25%] membuat rasio 16:9 otomatis */}
            <iframe
              src={block.data.embed}
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Embedded content"
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
              <span dangerouslySetInnerHTML={{ __html: block.data.caption }} />
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
};

// --- HELPER 2: Extract Text for Metadata (SEO) ---
const extractText = (content: any): string => {
  if (!content) return "";
  if (typeof content === 'string') return content.substring(0, 160);
  
  if (typeof content === 'object' && content.blocks) {
    const firstPara = content.blocks.find((b: any) => b.type === 'paragraph');
    return firstPara ? firstPara.data.text.substring(0, 160) : "";
  }
  return "";
}

// 1. Metadata SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${post.title} - Review JagoPilih`,
    description: extractText(post.content ?? ""),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) notFound();

  // Logic: Parsing Content
  let contentBlocks: any[] = [];
  let isLegacyText = false;

  const rawContent = post.content as any; 

  if (rawContent && typeof rawContent === 'object' && rawContent.blocks) {
     contentBlocks = rawContent.blocks;
  } else if (typeof rawContent === 'string') {
     isLegacyText = true;
  }

  const hasAffiliateLinks = post.shopeeLink || post.tokpedLink;

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20">
      
      {/* HEADER SECTION */}
      <header className="container max-w-5xl mx-auto px-6 mb-12">
        <Link 
           href="/blog" 
           className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-6 transition-colors"
        >
           <ChevronLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        <div className="text-center max-w-3xl mx-auto">
           <div className="flex items-center justify-center gap-4 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-4">
             <span className="flex items-center gap-1">
               <Calendar className="w-3 h-3" /> 
               {new Date(post.createdAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}
             </span>
             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
             <span className="flex items-center gap-1">
               <User className="w-3 h-3" /> Admin
             </span>
           </div>

           <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
             {post.title}
           </h1>
        </div>

        {post.thumbnail && (
          <div className="aspect-[21/9] w-full relative rounded-3xl overflow-hidden shadow-xl bg-gray-200">
            <img 
              src={post.thumbnail} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}
      </header>


      {/* MAIN CONTENT + SIDEBAR LAYOUT */}
      <div className="container max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* KOLOM KIRI: ARTIKEL */}
        <main className="lg:col-span-8">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
             
             {/* Kotak Ringkasan */}
             <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl mb-8">
                <h3 className="font-bold text-orange-800 text-lg mb-2">💡 Ringkasan Cepat</h3>
                <p className="text-orange-900/80 text-sm leading-relaxed">
                  Artikel ini membahas detail tentang {post.title}. Cocok untuk kamu yang sedang mencari referensi sebelum membeli.
                </p>
             </div>

             {/* Content Body */}
             <article className="prose prose-lg prose-gray max-w-none prose-img:rounded-xl prose-img:shadow-md">
                {isLegacyText ? (
                   <div className="whitespace-pre-wrap font-serif text-gray-700">
                      {String(rawContent)}
                   </div>
                ) : (
                   <div className="font-serif [&_a]:text-orange-600 [&_a]:underline hover:[&_a]:text-orange-800 [&_a]:font-bold">
                      {contentBlocks.map((block: any) => renderBlock(block))}
                      
                      {contentBlocks.length === 0 && (
                        <p className="text-gray-400 italic text-center py-10">
                          Konten sedang disiapkan.
                        </p>
                      )}
                   </div>
                )}
             </article>

          </div>
        </main>


        {/* KOLOM KANAN: SIDEBAR */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-28 space-y-6">
            
            {/* CTA Box (Penting untuk Affiliate: Tetap Disimpan) */}
            {/* 👇 Tampilkan Kotak CTA HANYA JIKA ada linknya */}
            {hasAffiliateLinks && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                 <h4 className="font-bold text-gray-900 mb-2">Tertarik Produk Ini?</h4>
                 <p className="text-sm text-gray-500 mb-4">Cek harga terbaru di marketplace.</p>
                 
                 <div className="space-y-3">
                   {/* Tombol Shopee (Muncul jika ada link) */}
                   {post.shopeeLink && (
                     <a 
                       href={post.shopeeLink}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                     >
                       Beli di Shopee <ArrowRight size={16}/>
                     </a>
                   )}

                   {/* Tombol Tokopedia (Muncul jika ada link) */}
                   {post.tokpedLink && (
                     <a 
                       href={post.tokpedLink}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                     >
                       Beli di Tokopedia <ArrowRight size={16}/>
                     </a>
                   )}
                 </div>
              </div>
            )}

            {/* Share Widget (Pengganti Tags & Tombol Share Lama) */}
            <ShareWidget title={post.title} slug={post.slug} />

          </div>
        </aside>

      </div>
    </div>
  );
}