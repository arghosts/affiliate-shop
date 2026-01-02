import { prisma } from "@/lib/prisma";
import MenuManager from "./menu-manager";

export default async function MenusPage() {
  // Fetch Menus urutkan berdasarkan 'order' ASC
  const menus = await prisma.navbarLink.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-coffee">Navigasi Menu</h1>
        <p className="text-gray-500">Atur link yang muncul di header website.</p>
      </div>

      <MenuManager initialMenus={menus} />
    </div>
  );
}