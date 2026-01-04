export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl bg-white shadow-sm my-10 rounded-lg border">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Kebijakan Privasi JagoPilih</h1>
      
      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800">1. Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan informasi minimal saat Anda mengunjungi situs kami, termasuk alamat IP, jenis perangkat, dan perilaku penjelajahan melalui cookie untuk meningkatkan pengalaman pengguna.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">2. Link Affiliate dan Pihak Ketiga</h2>
          <p>JagoPilih berpartisipasi dalam program affiliate (seperti Shopee dan Tokopedia). Jika Anda mengeklik link produk, pihak ketiga mungkin menggunakan cookie untuk melacak pembelian agar kami mendapatkan komisi tanpa biaya tambahan bagi Anda.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">3. Keamanan Data</h2>
          <p>Kami berkomitmen untuk menjaga keamanan data Anda. Kami tidak akan pernah menjual informasi pribadi Anda kepada pihak mana pun.</p>
        </div>
      </section>
    </div>
  );
}