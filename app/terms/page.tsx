import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, FileText, ShieldAlert, Scale, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan (Terms of Service) - JagoPilih",
  description: "Syarat dan ketentuan penggunaan situs JagoPilih, termasuk kebijakan konten, afiliasi, dan hak kekayaan intelektual.",
};

export default function TermsPage() {
  // Generate tanggal hari ini secara dinamis dalam format Indonesia
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

        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-coffee mb-4 tracking-tight">
            Syarat dan Ketentuan
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-center text-sm text-muted-brown font-medium">
            <span className="bg-coffee/5 px-3 py-1 rounded-full border border-coffee/10">
              Terms of Service
            </span>
            <span className="flex items-center gap-2" suppressHydrationWarning>
              <CalendarIcon className="w-4 h-4 text-gold-accent" />
              Terakhir Diperbarui: {lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-surface relative overflow-hidden">
          
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-coffee to-gold-accent"></div>

          <div className="prose prose-stone prose-lg max-w-none text-muted-brown">
            
            {/* INTRO */}
            <p className="lead">
              Selamat datang di <strong className="text-coffee">JagoPilih</strong> (jagopilih.vercel.app). 
              Harap membaca Syarat dan Ketentuan ini dengan saksama sebelum menggunakan situs kami. 
              Dengan mengakses dan menggunakan situs ini, Anda dianggap telah memahami dan menyetujui seluruh aturan di bawah ini.
            </p>

            <hr className="border-surface my-8" />

            {/* SECTION 1 */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-coffee m-0">1. Sifat Layanan & Penafian Umum</h1>
              </div>
              <p>
                JagoPilih adalah blog pribadi yang menyajikan artikel ulasan (review), rekomendasi produk, dan informasi umum.
              </p>
              <ul className="list-none pl-0 space-y-3 mt-4">
                <li className="pl-4 border-l-4 border-surface">
                  <strong className="text-gray-900">Opini Subjektif:</strong> Seluruh konten ulasan di situs ini adalah opini pribadi penulis berdasarkan pengalaman penggunaan atau riset data yang tersedia secara publik. Konten ini tidak dimaksudkan sebagai fakta absolut, nasihat profesional, atau panduan teknis yang mengikat.
                </li>
                <li className="pl-4 border-l-4 border-surface">
                  <strong className="text-gray-900">Tidak Ada Jaminan:</strong> Seluruh informasi disajikan "SEBAGAIMANA ADANYA" (<em>AS IS</em>). Kami tidak memberikan jaminan, baik tersurat maupun tersirat, mengenai kelengkapan, keakuratan, keandalan, atau ketersediaan informasi produk yang kami ulas.
                </li>
              </ul>
            </section>

            {/* SECTION 2 */}
            <section className="mb-10">
              <h1 className="text-xl font-bold text-coffee mb-4">2. Batasan Tanggung Jawab</h1>
              <p className="mb-4">
                Kami melindungi integritas konten kami, namun kami harus membatasi risiko hukum:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-gray-900">Perubahan Spesifikasi & Harga:</strong> Harga, stok, dan spesifikasi produk di marketplace dapat berubah sewaktu-waktu tanpa pemberitahuan. JagoPilih <strong>tidak bertanggung jawab</strong> atas kerugian, kesalahan pembelian, atau ketidaksesuaian barang yang diterima akibat perbedaan data antara situs kami dan pihak penjual.
                </li>
                <li>
                  <strong className="text-gray-900">Kerugian Pengguna:</strong> Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan informasi dari situs ini.
                </li>
              </ul>
            </section>

            {/* SECTION 3 - HIGHLIGHTED */}
            <section className="mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
              <h1 className="text-xl font-bold text-orange-800 mb-4 mt-0">3. Sanggahan Affiliate (Disclosure)</h1>
              <p className="text-sm">
                Transparansi adalah prioritas kami. Harap perhatikan bahwa:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  Beberapa tautan keluar (<em>outbound links</em>) menuju marketplace (seperti Shopee, Tokopedia) adalah <strong>link afiliasi</strong>.
                </li>
                <li>
                  Jika Anda membeli produk melalui link tersebut, kami mungkin mendapatkan <strong>komisi kecil</strong> dari platform terkait tanpa biaya tambahan sepeser pun bagi Anda.
                </li>
                <li>
                  Komisi ini membantu kami untuk terus mengelola situs dan membuat konten berkualitas. Namun, keberadaan komisi <strong>tidak memengaruhi</strong> objektivitas, independensi, atau penilaian jujur kami terhadap suatu produk (baik positif maupun negatif).
                </li>
              </ul>
            </section>

            {/* SECTION 4 */}
            <section className="mb-10">
              <h1 className="text-xl font-bold text-coffee mb-4">4. Tautan Pihak Ketiga</h1>
              <p>
                Situs kami berisi tautan ke situs web pihak ketiga yang tidak dioperasikan oleh kami. Kami tidak memiliki kendali atas konten, kebijakan privasi, atau praktik situs web pihak ketiga tersebut. Risiko yang timbul dari akses ke tautan luar sepenuhnya menjadi tanggung jawab pengguna.
              </p>
            </section>

            {/* SECTION 5 - HAKI */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-coffee m-0">5. Hak Kekayaan Intelektual (HAKI)</h1>
              </div>
              <p>
                Seluruh konten teks, logo, dan penataan di JagoPilih adalah hak milik pengelola situs, kecuali materi gambar produk yang merupakan hak cipta masing-masing merek/brand terkait yang digunakan di bawah prinsip <em>Fair Use</em> (Penggunaan Wajar) untuk tujuan ulasan.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6 not-prose">
                <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                  <h1 className="font-bold text-red-700 mb-2 uppercase text-xs tracking-wider">Dilarang Keras</h1>
                  <p className="text-sm text-red-900/80 leading-relaxed">
                    Menyalin, mempublikasikan ulang (<em>reupload</em>), atau mendistribusikan konten kami untuk tujuan komersial tanpa izin tertulis.
                  </p>
                </div>
                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <h1 className="font-bold text-green-700 mb-2 uppercase text-xs tracking-wider">Diperbolehkan (Kutipan)</h1>
                  <p className="text-sm text-green-900/80 leading-relaxed">
                    Anda diperbolehkan mengutip sebagian kecil konten kami dengan syarat wajib mencantumkan <strong>sumber tautan aktif (backlink)</strong> yang jelas ke artikel asli di JagoPilih.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 6 */}
            <section className="mb-0">
               <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                  <Scale className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-coffee m-0">6. Kepatuhan Hukum</h1>
              </div>
              <p>
                Syarat dan ketentuan ini diatur berdasarkan hukum Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan terlebih dahulu melalui musyawarah mufakat.
              </p>
              <p className="text-sm text-gray-500 italic mt-4">
                *Kami berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Pengguna disarankan memeriksa halaman ini secara berkala.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

// Icon helper untuk tanggal
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