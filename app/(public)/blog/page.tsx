import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image"; // 👈 TAMBAHKAN INI

export const metadata: Metadata = {
  title: "Blog & Review Belanja - JagoPilih",
  description: "Kumpulan artikel review, tips, dan rekomendasi belanja terbaik.",
};

// Helper untuk mengambil potongan teks dari JSON Editor.js
const getSnippet = (content: any) => {
  if (!content) return "";
  // Jika masih format lama (String)
  if (typeof content === 'string') return content.substring(0, 120) + "...";
  
  // Jika format baru (JSON Editor.js)
  if (typeof content === 'object' && content.blocks) {
    const firstPara = content.blocks.find((b: any) => b.type === 'paragraph');
    // Ambil text paragraf pertama, atau default text jika isinya cuma gambar
    return firstPara ? firstPara.data.text.substring(0, 120) + "..." : "Klik untuk membaca selengkapnya.";
  }
  
  return "";
};

export default async function BlogIndexPage() {
  // Ambil semua artikel, urutkan dari yang terbaru
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20">
      <div className="container max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Blog & Review
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan insight mendalam dan rekomendasi gadget jujur dari tim JagoPilih.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {posts.map((post, index) => (
    // 1. Ganti <Link> pembungkus utama menjadi <div> biasa
    <div 
      key={post.id} 
      className="group bg-white rounded-3xl overflow-hidden border border-coffee/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* 2. Bungkus THUMBNAIL dengan Link sendiri */}
      <Link href={`/blog/${post.slug}`} className="relative aspect-video bg-gray-100 overflow-hidden block">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-coffee/5 text-coffee/20">
            <span className="font-black text-4xl">JP.</span>
          </div>
        )}
      </Link>

      {/* Content Text */}
      <div className="p-8 flex flex-col flex-1">
        
        {/* Date */}
        <div className="flex items-center gap-2 text-xs font-bold text-gold-accent mb-4 uppercase tracking-widest" suppressHydrationWarning>
          <Calendar className="w-3 h-3" />
          {new Date(post.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {/* 3. Bungkus JUDUL dengan Link sendiri */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold text-coffee mb-4 leading-tight group-hover:text-gold-accent transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Snippet Content */}
        <div className="text-muted-brown text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
           <span dangerouslySetInnerHTML={{ __html: getSnippet(post.content) }} />
        </div>

        {/* --- AREA TOMBOL ACTION --- */}
        <div className="mt-auto space-y-4">
          
          {/* Tombol Affiliate (Link Eksternal) - AMAN karena di luar Link Artikel */}
          {(post.shopeeLink || post.tokpedLink) && (
             <div className="flex gap-2">
                {post.shopeeLink && (
                  <a href={post.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 bg-orange-50 text-orange-600 text-xs font-bold py-2 px-3 rounded-lg text-center hover:bg-orange-100">
                    Shopee
                  </a>
                )}
                {post.tokpedLink && (
                  <a href={post.tokpedLink} target="_blank" rel="noreferrer" className="flex-1 bg-green-50 text-green-600 text-xs font-bold py-2 px-3 rounded-lg text-center hover:bg-green-100">
                    Tokopedia
                  </a>
                )}
             </div>
          )}

          {/* Link "Baca Selengkapnya" */}
          <Link href={`/blog/${post.slug}`} className="flex items-center text-sm font-bold text-coffee group-hover:text-gold-accent gap-2">
            Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>

        </div>
      </div>
    </div>
  ))}
</div>

        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>Belum ada artikel yang ditulis.</p>
          </div>
        )}

      </div>
    </div>
  );
}