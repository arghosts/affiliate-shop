import { PrismaClient, MarketplaceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai Seeding...");

  // 1. BERSIHKAN DATA LAMA (Urutan penting karena Foreign Key!)
  await prisma.priceHistory.deleteMany();
  await prisma.productLink.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.post.deleteMany(); // Blog post lama

  console.log("🧹 Data lama dibersihkan.");

  // 2. BUAT KATEGORI
  const catSmartphone = await prisma.category.create({
    data: { name: "Smartphone", slug: "smartphone" },
  });

  // 3. BUAT PRODUK PARENT (Samsung S24)
  // Perhatikan: minPrice diisi harga terendah dari simulasi link di bawah
  const productS24 = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 8/256GB",
      slug: "samsung-galaxy-s24-8-256gb",
      description: "Smartphone flagship Samsung tahun 2024 dengan AI features.",
      minPrice: 13500000, // Sesuai harga termurah (Tokopedia)
      maxPrice: 14000000, // Sesuai harga termahal (Official)
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800",
      ],
      categoryId: catSmartphone.id,
      isFeatured: true,
      pros: "Layar cerah, performa kencang, Galaxy AI",
      cons: "Baterai standar, charging 25W",
    },
  });

  console.log("📱 Produk Samsung S24 dibuat.");

  // 4. BUAT PRODUCT LINKS (Skenario Perbandingan)

  // Link A: Shopee (Official Store) - Harga Stabil
  const linkShopee = await prisma.productLink.create({
    data: {
      productId: productS24.id,
      marketplace: MarketplaceType.SHOPEE,
      storeName: "Samsung Official Shop",
      originalUrl: "https://shopee.co.id/samsung-s24-dummy",
      affiliateUrl: "https://shopee.co.id/universal-link/...",
      currentPrice: 13999000,
      isStockReady: true,
      isVerified: true,
      region: null, // Nasional
    },
  });

  // Link B: Tokopedia (Star Seller Jakarta) - Harga Termurah
  const linkTokped = await prisma.productLink.create({
    data: {
      productId: productS24.id,
      marketplace: MarketplaceType.TOKOPEDIA,
      storeName: "Jakarta Gadget Center",
      originalUrl: "https://tokopedia.com/dummy-link",
      currentPrice: 13500000, // Pemenang harga murah
      isStockReady: true,
      isVerified: false,
      region: "Jakarta",
    },
  });

  // Link C: LOKAL HERO (Bojonegoro) - Konsep "Boring but True"
  // User lokal lebih baik beli di sini meski lebih mahal 200rb (dapat barang langsung)
  const linkLokal = await prisma.productLink.create({
    data: {
      productId: productS24.id,
      marketplace: MarketplaceType.WHATSAPP_LOKAL,
      storeName: "Bojonegoro Cell (Depan Alun-Alun)",
      originalUrl: "https://wa.me/6281234567890?text=Halo%20gan%20mau%20S24",
      currentPrice: 13700000, 
      isStockReady: true,
      isVerified: true, // Karena Anda sudah cek fisik tokonya
      region: "Bojonegoro", // FILTER REGIONAL ANCHOR
    },
  });

  console.log("🔗 3 Link Toko (Shopee, Tokped, Lokal) dibuat.");

  // 5. BUAT PRICE HISTORY (Untuk Data Grafik)
  // Kita buat simulasi harga Tokopedia yang fluktuatif
  await prisma.priceHistory.createMany({
    data: [
      {
        productLinkId: linkTokped.id,
        price: 13800000,
        recordedAt: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 hari lalu
      },
      {
        productLinkId: linkTokped.id,
        price: 13650000,
        recordedAt: new Date(new Date().setDate(new Date().getDate() - 3)), // 3 hari lalu
      },
      {
        productLinkId: linkTokped.id,
        price: 13500000,
        recordedAt: new Date(), // Hari ini
      },
    ],
  });

  console.log("📈 Data histori harga dummy dibuat.");

  // 6. KONTEN BLOG (Tetap dipertahankan)
  await prisma.post.create({
    data: {
      title: "Review Samsung S24: Apakah Worth It?",
      slug: "review-samsung-s24",
      thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
      content: {
        time: 167823,
        blocks: [
          {
            id: "header1",
            type: "header",
            data: { text: "Pendahuluan", level: 2 },
          },
          {
            id: "para1",
            type: "paragraph",
            data: {
              text: "Samsung kembali merilis seri S24 dengan fokus utama pada kecerdasan buatan.",
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed berhasil selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });