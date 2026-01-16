import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";
import SearchBar from "./SearchBar"; // ✅ Import Komponen Baru

export default async function Navbar() {
  // Fetch Data dari DB (Cache-friendly)
  const settings = await prisma.siteSetting.findFirst();
  const navLinks = await prisma.navbarLink.findMany({
    orderBy: { order: 'asc' }
  });

  const siteName = settings?.siteName ?? "TokoAffiliate";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black text-coffee tracking-tighter">
          {siteName}<span className="text-gold-accent">.vercel.app</span>
        </Link>

        {/* SEARCH BAR (Tengah) - ✅ PASANG DISINI */}
        <SearchBar />

        {/* MENU KANAN */}
        <div className="flex items-center gap-6">
          {/* Menu Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.id}
                href={link.url} 
                className="text-sm font-bold text-muted-brown hover:text-gold-accent transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Button */}
          <Link 
            href="/#products"
            className="flex items-center gap-2 bg-coffee text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gold-accent transition-colors shadow-lg shadow-coffee/20"
            aria-label="Jelajahi"
          >
            <ShoppingBag className="w-4 h-4" /> 
            <span className="hidden sm:inline">Jelajahi</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}