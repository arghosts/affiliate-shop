import { prisma } from "@/lib/prisma";
import TagManager from "./tag-manager";

export default async function TagsPage() {
  // Fetch tags beserta jumlah penggunaannya di produk (untuk info user)
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-coffee">Manajemen Tags</h1>
        <p className="text-gray-500">Buat label untuk mengelompokkan produk (contoh: 'Terlaris', 'Budget').</p>
      </div>

      <TagManager initialTags={tags} />
    </div>
  );
}