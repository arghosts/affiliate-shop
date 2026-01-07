import { prisma } from "@/lib/prisma";
import ProductFormShared from "../../product-form-shared"; // Import Shared Form
import { updateProduct } from "./actions"; // Import Action Edit
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Product Data
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      tags: true, // Tags perlu diambil untuk pre-checked checkbox
    }
  });

  if (!product) notFound();

  // 2. Fetch Dropdown Data
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  // 3. Mapping data ke format yang diminta Form
  // Decimal prisma harus dikonversi ke number
  const initialData = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-coffee">Edit Produk</h1>
        <p className="text-gray-500">Perbarui data produk: {product.name}</p>
      </div>

      <ProductFormShared 
        categories={categories} 
        tags={tags} 
        action={updateProduct} // Pakai action Edit
        initialData={initialData}    // Masukkan data lama
      />
    </div>
  );
}