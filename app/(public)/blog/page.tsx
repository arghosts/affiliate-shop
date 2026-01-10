import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image"; // Import Image wajib ada

export const metadata: Metadata = {
  title: "Blog & Review Belanja - JagoPilih",
  description: "Kumpulan artikel review, tips, dan rekomendasi belanja terbaik.",
};

// 1. Helper: Hapus tag HTML biar aman saat dipotong (Mencegah Error Hydration)
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
}

// 2. Helper: Ambil snippet teks bersih
const getSnippet = (content: any) => {
  if (!content) return "";
  
  let text = "";

  // Handle jika format String (HTML Raw dari Summernote/Tiptap dll)
  if (typeof content === 'string') {
    text = content;
  }
  // Handle jika format JSON (Editor.js)
  else if (typeof content === 'object' && content.blocks) {
    const firstPara = content.blocks.find((b: any) => b.type === 'paragraph');
    text = firstPara ? firstPara.data.text : "";
  }

  // Bersihkan HTML dulu, baru dipotong
  const cleanText = stripHtml(text); 
  
  // Potong teks jika kepanjangan
  return cleanText.length > 120 ? cleanText.substring(0, 120) + "..." : cleanText;
};

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-coffee tracking-tighter mb-4">
            Jago<span className="text-gold-accent">Journal</span>.
          </h1>
          <p className="text-muted-brown text-lg max-w-2xl mx-auto">
            Insight mendalam seputar gadget, setup produktivitas, dan tips teknologi terkini.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            // WRAPPER UTAMA: Menggunakan DIV (Bukan Link) agar tidak Error Nested Links
            <div 
              key={post.id} 
              className="group bg-white rounded-3xl overflow-hidden border border-coffee/5 shadow-sm hover:shadow-xl hover:shadow-gold-accent/10 transition-all duration-300 flex flex-col"
            >
              {/* 1. THUMBNAIL (Link Sendiri) */}
              <Link href={`/blog/${post.slug}`} className="relative aspect-video bg-gray-100 overflow-hidden block">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    // Hanya priority untuk item pertama
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-coffee/5 text-coffee/20">
                    <span className="font-black text-4xl">JP.</span>
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* CONTENT BODY */}
              <div className="p-8 flex flex-col flex-1">
                
                {/* Date dengan suppressHydrationWarning */}
                <div 
                  className="flex items-center gap-2 text-xs font-bold text-gold-accent mb-4 uppercase tracking-widest"
                  suppressHydrationWarning 
                >
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                {/* 2. JUDUL (Link Sendiri) */}
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-coffee mb-4 leading-tight group-hover:text-gold-accent transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                {/* 3. DESKRIPSI (Plain Text - Aman dari Error HTML) */}
                <p className="text-muted-brown text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                   {getSnippet(post.content)}
                </p>

                {/* --- AREA TOMBOL ACTION --- */}
                <div className="mt-auto space-y-4">
                  
                  {/* Tombol Affiliate (Link Eksternal) - AMAN karena di luar Link Artikel */}
                  {(post.shopeeLink || post.tokpedLink) && (
                     <div className="flex gap-2">
                        {post.shopeeLink && (
                          <a href={post.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 bg-orange-50 text-orange-600 text-xs font-bold py-2 px-3 rounded-lg text-center hover:bg-orange-100 transition-colors">
                            Shopee
                          </a>
                        )}
                        {post.tokpedLink && (
                          <a href={post.tokpedLink} target="_blank" rel="noreferrer" className="flex-1 bg-green-50 text-green-600 text-xs font-bold py-2 px-3 rounded-lg text-center hover:bg-green-100 transition-colors">
                            Tokopedia
                          </a>
                        )}
                     </div>
                  )}

                  {/* 4. Link "Baca Selengkapnya" */}
                  <Link href={`/blog/${post.slug}`} className="flex items-center text-sm font-bold text-coffee group-hover:text-gold-accent gap-2 transition-colors">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Link>

                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-coffee/10 rounded-3xl">
            <p className="text-muted-brown font-bold">Belum ada artikel yang diterbitkan.</p>
          </div>
        )}

      </div>
    </div>
  );
}