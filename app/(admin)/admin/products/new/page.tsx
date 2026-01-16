import { prisma } from "@/lib/prisma";
import ProductFormShared from "../product-form-shared"; 
import { createProduct } from "./../actions";       

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  // Ambil data pendukung untuk form
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="pb-20 pt-6 px-6">
       <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>
       
       {/* Panggil Shared Form */}
       <ProductFormShared
         categories={categories}
         tags={tags}
         action={createProduct} // ✅ Pass function action yang benar
         initialData={null}     // null karena ini halaman Create
       />
    </div>
  );
}