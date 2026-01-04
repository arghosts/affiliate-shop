export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl bg-white shadow-sm my-10 rounded-lg border">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Syarat dan Ketentuan</h1>
      
      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>Dengan mengakses JagoPilih, Anda dianggap telah menyetujui syarat dan ketentuan berikut.</p>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800">1. Penggunaan Konten</h2>
          <p>Seluruh konten review di JagoPilih adalah untuk tujuan informasi. Kami berusaha memberikan data seakurat mungkin, namun kami tidak bertanggung jawab atas kesalahan harga atau spesifikasi yang dapat berubah sewaktu-waktu di marketplace.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">2. Sanggahan Affiliate (Disclosure)</h2>
          <p>Beberapa link di situs ini adalah link affiliate. Sebagai pemberi rekomendasi, kami mendapatkan komisi kecil dari pembelian yang memenuhi syarat tanpa ada biaya tambahan bagi pembeli.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">3. Hak Kekayaan Intelektual</h2>
          <p>Dilarang menyalin atau mendistribusikan konten tulisan dari JagoPilih tanpa izin tertulis atau mencantumkan sumber link yang jelas.</p>
        </div>
      </section>
    </div>
  );
}