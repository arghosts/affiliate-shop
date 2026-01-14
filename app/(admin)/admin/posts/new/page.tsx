import { createPost } from "../actions";
import PostForm from "../post-form"; // Import komponen shared
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  
  // Fetch data produk untuk dropdown picker
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="pb-20 pt-6 px-6">
       <h1 className="text-2xl font-bold mb-6 text-gray-800">Tulis Artikel Baru</h1>
       
       <PostForm 
         action={createPost} 
         products={products} // Kirim data produk ke Client Component
         initialData={null}
       />
    </div>
  );
}