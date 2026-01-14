import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "../../post-form"; 
import { updatePost } from "../../actions"; 

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) notFound();
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="pb-20 pt-6 px-6">
      {/* Kita kirim updatePost mentah-mentah, nanti PostForm yang ngatur cara panggilnya */}
      <PostForm 
        action={updatePost}
        products={products}
        initialData={post} 
      />
    </div>
  );
}