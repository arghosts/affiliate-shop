import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Share2 } from "lucide-react";
import { Metadata } from "next";

// 1. Generate Metadata untuk SEO (Judul di Tab Browser)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${post.title} - Blog Affiliate`,
    description: post.content.substring(0, 160), // Ambil 160 karakter pertama
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 2. Fetch Data Artikel
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) notFound();

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-20">
      
      {/* Container Lebar Terbatas (agar enak dibaca) */}
      <article className="container max-w-3xl mx-auto px-6">
        
        {/* Back Button */}
        <Link 
           href="/blog" 
           className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gold-accent mb-8 transition-colors"
        >
           <ChevronLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        {/* Header Artikel */}
        <header className="mb-10 text-center">
           <div className="flex items-center justify-center gap-2 text-sm font-medium text-gold-accent mb-4">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("id-ID", { dateStyle: 'full' })}
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-coffee leading-tight mb-8">
              {post.title}
           </h1>
           
           {/* Thumbnail Besar */}
           {post.thumbnail && (
             <div className="aspect-video w-full relative rounded-3xl overflow-hidden shadow-lg shadow-coffee/10">
               <img 
                 src={post.thumbnail} 
                 alt={post.title} 
                 className="w-full h-full object-cover"
               />
             </div>
           )}
        </header>

        {/* Content Body */}
        {/* Menggunakan whitespace-pre-wrap agar enter/paragraf terbaca jika input manual */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-surface">
           <div className="prose prose-brown prose-lg max-w-none prose-headings:font-black prose-headings:text-coffee prose-a:text-gold-accent hover:prose-a:underline prose-img:rounded-2xl">
             {/* Jika nanti pakai Rich Text Editor yang menghasilkan HTML, gunakan dangerouslySetInnerHTML.
                Untuk sekarang (Textarea biasa), kita render text biasa dengan style whitespace.
             */}
             <div className="whitespace-pre-wrap leading-relaxed text-gray-600">
                {post.content}
             </div>
           </div>
        </div>

        {/* Share Section (Dummy) */}
        <div className="mt-12 flex justify-center">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-coffee hover:bg-gold-accent hover:text-white hover:border-gold-accent transition-all shadow-sm">
             <Share2 className="w-4 h-4" /> Bagikan Artikel
           </button>
        </div>

      </article>
    </div>
  );
}