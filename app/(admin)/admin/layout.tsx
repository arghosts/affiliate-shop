import Link from "next/link";
import { LayoutDashboard, Package, Settings, LogOut, ExternalLink, Tag, LayoutList } from "lucide-react";
import { deleteSession } from "@/lib/session"; // Import utility logic
import { Toaster } from "react-hot-toast";


// ✅ BUAT SERVER ACTION WRAPPER DISINI
async function logoutAction() {
  "use server"; // Directive wajib untuk form action
  await deleteSession();
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 2. Pasang Toaster di sini (bisa ditaruh dimana saja asal di dalam body) */}
      <Toaster position="top-right" reverseOrder={false} />
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-coffee text-white flex flex-col fixed h-full z-10 shadow-xl">
        {/* Header Sidebar */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <h2 className="text-xl font-black tracking-widest uppercase">
            Admin<span className="text-gold-accent">Panel</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1 transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1 transition-all"
          >
            <Package className="w-5 h-5" />
            Produk
          </Link>

          <Link 
            href="/admin/tags" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1 transition-all"
          >
            <Tag className="w-5 h-5" />
            Tags / Label
          </Link>
          <Link 
            href="/admin/menus" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1 transition-all"
          >
            <LayoutList className="w-5 h-5" />
            Navigasi Menu
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1 transition-all"
          >
            <Settings className="w-5 h-5" />
            Pengaturan Web
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-3 mb-3 text-xs font-bold bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-gold-accent"
          >
            <ExternalLink className="w-3 h-3" /> Lihat Website
          </Link>
          
          {/* ✅ PANGGIL ACTION DISINI */}
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}