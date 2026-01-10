import type { Metadata } from "next";
import Link from "next/link";
import { 
  ChevronLeft, 
  Shield, 
  Lock, 
  Eye, 
  Cookie, 
  Coins, 
  Users, 
  Mail, 
  CheckCircle 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) - JagoPilih",
  description: "Pelajari bagaimana JagoPilih mengumpulkan, menggunakan, dan melindungi data pribadi serta kebijakan afiliasi kami.",
};

export default function PrivacyPage() {
  // Generate tanggal hari ini secara dinamis format Indonesia
  const lastUpdated = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-warm-bg pt-32 pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="container mx-auto px-6 mb-10 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-brown/70 hover:text-gold-accent transition-colors mb-8 group"
        >
          <div className="p-1 rounded-full bg-white group-hover:bg-gold-accent group-hover:text-white transition-all">
             <ChevronLeft className="w-4 h-4" />
          </div>
          Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-coffee tracking-tighter mb-4">
              Kebijakan <span className="text-gold-accent">Privasi</span>
            </h1>
            <p className="text-muted-brown text-lg font-medium max-w-xl leading-relaxed">
              Komitmen kami untuk melindungi data pribadi dan transparansi penggunaan cookies afiliasi Anda.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-surface backdrop-blur-sm">
             <CalendarIcon className="w-4 h-4 text-gold-accent" />
             <span className="text-xs font-bold text-coffee uppercase tracking-wider" suppressHydrationWarning>
               Update: {lastUpdated}
             </span>
          </div>
        </div>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-surface relative overflow-hidden">
          
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-accent/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />

          <div className="prose prose-brown prose-lg max-w-none relative z-10">
            
            {/* Intro */}
            <p className="lead">
              Di <strong>JagoPilih</strong> (jagopilih.vercel.app), privasi pengunjung adalah prioritas yang sangat serius bagi kami. Dokumen Kebijakan Privasi ini menjelaskan jenis informasi apa yang dikumpulkan dan dicatat oleh JagoPilih serta bagaimana kami menggunakannya.
            </p>

            <hr className="border-gray-100 my-10" />

            {/* 1. Log Files */}
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-coffee m-0">1. Informasi yang Kami Kumpulkan (Log Files)</h2>
              </div>
              <p>
                JagoPilih mengikuti prosedur standar menggunakan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web. Informasi yang dikumpulkan meliputi:
              </p>
              <ul className="text-base text-gray-600 space-y-2 mt-4">
                <li>Alamat Protokol Internet (IP Address).</li>
                <li>Jenis browser & Penyedia Layanan Internet (ISP).</li>
                <li>Tanggal dan waktu kunjungan.</li>
                <li>Halaman rujukan/keluar (referring/exit pages).</li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-xl mt-4 border-l-4 border-gold-accent text-sm text-gray-600">
                Data ini digunakan untuk analisis tren dan pengelolaan situs. Data ini <strong>tidak terkait</strong> dengan informasi apa pun yang dapat diidentifikasi secara pribadi (seperti nama atau alamat rumah Anda).
              </div>
            </section>

            {/* 2. Cookies */}
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <Cookie className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-coffee m-0">2. Cookies dan Web Beacons</h2>
              </div>
              <p>
                Seperti situs web lainnya, JagoPilih menggunakan 'cookies'. Cookies ini digunakan untuk menyimpan informasi termasuk preferensi pengunjung, dan halaman di situs web yang diakses atau dikunjungi pengunjung. Informasi tersebut digunakan untuk mengoptimalkan pengalaman pengguna dengan menyesuaikan konten halaman web kami.
              </p>
            </section>

            {/* 3. Affiliate Disclosure (PENTING) */}
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                  <Coins className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-coffee m-0">3. Pengungkapan Afiliasi (Affiliate Disclosure)</h2>
              </div>
              <p>
                JagoPilih adalah peserta dalam berbagai program afiliasi marketing. Ini berarti:
              </p>
              <ul className="text-base text-gray-600 space-y-2">
                <li>Ketika Anda mengklik tautan produk di situs kami (seperti ke Shopee, Tokopedia, dll), sebuah <strong>cookie khusus</strong> akan ditempatkan di browser Anda untuk melacak asal rujukan.</li>
                <li>Cookie ini memastikan kami bisa mendapatkan komisi kecil jika Anda melakukan pembelian, <strong>tanpa biaya tambahan</strong> bagi Anda.</li>
                <li>Data transaksi pembayaran Anda diproses sepenuhnya oleh pihak marketplace, bukan oleh JagoPilih. Kami tidak pernah melihat data kartu kredit Anda.</li>
              </ul>
            </section>

            {/* 4. Pihak Ketiga */}
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-coffee m-0">4. Kebijakan Privasi Pihak Ketiga</h2>
              </div>
              <p>
                Server iklan pihak ketiga atau jaringan iklan mungkin menggunakan teknologi seperti cookies, JavaScript, atau Web Beacons dalam iklan mereka yang muncul di JagoPilih.
              </p>
              <p className="text-sm italic">
                *JagoPilih tidak memiliki akses atau kontrol atas cookies yang digunakan oleh pengiklan pihak ketiga. Kami menyarankan Anda untuk berkonsultasi dengan Kebijakan Privasi masing-masing dari server iklan pihak ketiga ini.
              </p>
            </section>

            {/* 5. Informasi Anak */}
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-coffee m-0">5. Informasi Anak</h2>
              </div>
              <p>
                Kami mendorong orang tua untuk memantau aktivitas online anak-anak mereka. JagoPilih <strong>tidak secara sadar</strong> mengumpulkan Informasi Identifikasi Pribadi apa pun dari anak-anak di bawah usia 13 tahun.
              </p>
            </section>

             {/* 6. Consent */}
             <section className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-coffee m-0">6. Persetujuan (Consent)</h2>
              </div>
              <p>
                Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui Syarat dan Ketentuannya.
              </p>
            </section>

            {/* 7. Contact */}
            <section className="bg-warm-bg/50 p-8 rounded-2xl border border-coffee/5 text-center">
               <div className="inline-flex p-3 bg-white rounded-full shadow-sm mb-4 text-coffee">
                  <Mail className="w-6 h-6" />
               </div>
               <h2 className="text-xl font-bold text-coffee mb-2 mt-0">Ada Pertanyaan?</h2>
               <p className="text-gray-600 mb-4 text-sm">
                 Jika Anda memiliki pertanyaan mengenai kebijakan ini, hubungi kami melalui:
               </p>
               <a 
                 href="mailto:arghost.viles@gmail.com" 
                 className="inline-block bg-coffee text-white font-bold py-3 px-8 rounded-xl hover:bg-gold-accent transition-colors shadow-lg shadow-coffee/20"
               >
                 arghost.viles@gmail.com
               </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Icon untuk Tanggal
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}