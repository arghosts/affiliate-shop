import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText, Calendar } from "lucide-react";

// Component Delete Button Kecil (Inline)
// Idealnya dipisah file, tapi biar cepat kita taruh sini pakai 'use server' action di form
import DeleteButton from "./delete-button"; // ⚠️ Kita buat file ini sebentar lagi

export default async function PostListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-coffee">Artikel Blog</h1>
          <p className="text-gray-500">Kelola konten review dan tips.</p>
        </div>
        <Link 
          href="/admin/posts/new" 
          className="bg-gold-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-gold-accent/20"
        >
          <Plus className="w-5 h-5" /> Tulis Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            
            {/* Thumbnail */}
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
               {post.thumbnail ? (
                 <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               ) : (
                 <div className="flex items-center justify-center w-full h-full text-gray-300"><FileText className="w-10 h-10" /></div>
               )}
            </div>

            {/* Content */}
            <h3 className="font-bold text-coffee text-lg leading-tight mb-2 line-clamp-2 min-h-[3rem]">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
               <Calendar className="w-3 h-3" />
               {new Date(post.createdAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
               <Link 
                 href={`/admin/posts/${post.id}/edit`} 
                 className="flex-1 text-center py-2 rounded-lg bg-gray-50 text-coffee text-xs font-bold hover:bg-gold-accent hover:text-white transition-colors"
               >
                 Edit
               </Link>
               {/* Gunakan Delete Button yang sudah kita buat untuk Product, tapi perlu modifikasi action */}
               <DeleteButton postId={post.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}