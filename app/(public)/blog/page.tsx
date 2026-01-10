import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id} 
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-gray-200 relative overflow-hidden">
                {post.thumbnail ? (
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta Date */}
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-3 uppercase tracking-wider" suppressHydrationWarning={true}>
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <div className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {/* Gunakan helper snippet di sini */}
                  <span dangerouslySetInnerHTML={{ __html: getSnippet(post.content) }} />
                </div>

                <div className="flex items-center text-sm font-bold text-gray-900 group-hover:text-orange-600 mt-auto">
                  Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </Link>
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