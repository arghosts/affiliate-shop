import { prisma } from "@/lib/prisma";
import { Package, MousePointerClick, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

// Helper Component untuk Card Statistik
function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-coffee">{value}</h3>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  // 1. Fetch Data Statistik Real-time
  const productCount = await prisma.product.count();
  
  // ✅ PERBAIKAN SCHEMA BARU:
  const activeLinks = await prisma.productLink.count({
    where: {
      isStockReady: true // Opsional: Hanya hitung yang stoknya ready
    }
  });

  // Contoh data dummy untuk chart/goals
  const monthlyTarget = 50; 

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-coffee">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan performa ekosistem affiliate Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Produk" 
          value={productCount} 
          icon={Package} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Opsi Toko Aktif" // Ubah label agar lebih akurat
          value={activeLinks} 
          icon={MousePointerClick} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          title="Target Review" 
          value={`${productCount}/${monthlyTarget}`} 
          icon={Activity} 
          colorClass="bg-orange-500" 
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-coffee">Status Sistem</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Normal</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-600">Database Connected</span>
             </div>
             <span className="text-xs font-mono text-gray-400">PostgreSQL (Neon)</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-600">Schema Version</span>
             </div>
             <span className="text-xs font-mono text-gray-400">Multi-Vendor (v2)</span>
          </div>
        </div>
      </div>
    </div>
  );
}