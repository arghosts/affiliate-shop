import { prisma } from "@/lib/prisma";
import PostForm from "../../post-form"; // Import Form Shared
import { updatePost } from "../../actions"; // Import Action Update
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Ambil ID dari URL
  const { id } = await params;

  // 2. Cari Artikel di Database berdasarkan ID
  const post = await prisma.post.findUnique({
    where: { id },
  });

  // 3. Jika tidak ketemu, lempar ke halaman 404
  if (!post) {
    notFound();
  }

  return (
    <div className="pb-20">
      {/* 4. Panggil Form dengan action 'updatePost' DAN data artikel lama */}
      <PostForm 
        action={updatePost} 
        initialData={post} 
      />
    </div>
  );
}