import { prisma } from "@/lib/prisma";
import ProductFormShared from "../product-form-shared"; // Pakai Shared Form
import { createProductAction } from "./actions";       // Pakai Action Create lama

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-coffee">Tambah Produk Baru</h1>
        <p className="text-gray-500">Masukkan detail produk affiliate.</p>
      </div>

      <ProductFormShared 
        categories={categories} 
        tags={tags} 
        action={createProductAction} // Pakai action Create
        initialData={null}           // Data kosong
      />
    </div>
  );
}