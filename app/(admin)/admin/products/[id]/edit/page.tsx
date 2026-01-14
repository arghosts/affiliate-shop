import { prisma } from "@/lib/prisma";
import ProductFormShared from "../../product-form-shared"; 
import { updateProductWithId } from "./../../actions"; // Pastikan nama export sesuai di actions.ts
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // 1. Ambil ID dari params
  const { id } = await params;

  // 2. Fetch Product dengan relasi links
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      tags: true,  
      links: true, 
    }
  });

  // Jika produk tidak ditemukan, tampilkan 404
  if (!product) notFound();

  // 3. Fetch data pendukung dropdown
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  // 4. Persiapkan Initial Data untuk Form
  const initialData = JSON.parse(JSON.stringify({
  ...product,
  links: product.links, 
}));

  // 5. ✅ BIND ID KE ACTION (Dilakukan di sini karena variabel 'product' sudah ada)
  const updateActionWithId = updateProductWithId.bind(null, product.id);

  return (
    <div className="pb-20 pt-6 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
        <p className="text-gray-500 text-sm">
          Perbarui data: <span className="font-bold text-coffee">{product.name}</span>
        </p>
      </div>
      
      <ProductFormShared
        categories={categories}
        tags={tags}
        action={updateActionWithId} // Gunakan action yang sudah di-bind dengan ID
        initialData={initialData}
      />
    </div>
  );
}