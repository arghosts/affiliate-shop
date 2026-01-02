import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ChevronRight, FileText } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Artikel - Review Gadget Terbaru",
  description: "Tips, trik, dan review mendalam seputar teknologi terkini.",
};

export const revalidate = 60; // Revalidate setiap 60 detik (ISR)

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-accent font-bold tracking-widest uppercase text-xs mb-2 block">
            Insight & News
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-coffee mb-6">
            Artikel Terbaru
          </h1>
          <p className="text-muted-brown leading-relaxed">
            Dapatkan informasi mendalam sebelum Anda memutuskan untuk membeli gadget impian.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-surface hover:shadow-xl hover:shadow-coffee/5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                {post.thumbnail ? (
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
                {/* Overlay Date */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-coffee flex items-center gap-2 shadow-sm">
                   <Calendar className="w-3 h-3 text-gold-accent" />
                   {new Date(post.createdAt).toLocaleDateString("id-ID", { dateStyle: 'medium' })}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-coffee mb-3 group-hover:text-gold-accent transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {/* Ambil cuplikan teks dari konten HTML/String */}
                  {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                </p>
                
                <div className="flex items-center text-sm font-bold text-gold-accent mt-auto">
                  Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 italic">Belum ada artikel yang diterbitkan.</p>
          </div>
        )}

      </div>
    </div>
  );
}