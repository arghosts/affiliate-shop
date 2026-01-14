import { PrismaClient, MarketplaceType } from "@prisma/client";
import * as bcrypt from "bcryptjs"; // ✅ WAJIB IMPORT INI

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai Seeding...");

  // 1. BERSIHKAN DATA LAMA
  // Hapus data relasi dulu agar tidak error constraint
  await prisma.priceHistory.deleteMany();
  await prisma.productLink.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.post.deleteMany(); 
  
  // Opsional: Hapus admin jika ingin fresh start, tapi upsert di bawah sudah menangani
  // await prisma.admin.deleteMany(); 

  console.log("🧹 Data lama dibersihkan.");

  // 2. BUAT ADMIN DENGAN PASSWORD HASH (FIX UTAMA DISINI)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt); // ✅ HASHING

  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword // ✅ Update password jadi hash jika user sudah ada
    },
    create: {
      username: 'admin',
      password: hashedPassword, // ✅ Simpan sebagai hash
    },
  });

  console.log("👤 Admin dibuat/diupdate: username='admin', password='password123'");


  // --- BAGIAN PRODUK (TIDAK ADA PERUBAHAN) ---

  const catSmartphone = await prisma.category.create({
    data: { name: "Smartphone", slug: "smartphone" },
  });

  const productS24 = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 8/256GB",
      slug: "samsung-galaxy-s24-8-256gb",
      description: "Smartphone flagship Samsung tahun 2024 dengan AI features.",
      minPrice: 13500000,
      maxPrice: 14000000,
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800",
      ],
      categoryId: catSmartphone.id,
      isFeatured: true,
      pros: "Layar cerah, performa kencang, Galaxy AI",
      cons: "Baterai standar, charging 25W",
    },
  });

  const linkTokped = await prisma.productLink.create({
    data: {
      productId: productS24.id,
      marketplace: MarketplaceType.TOKOPEDIA,
      storeName: "Jakarta Gadget Center",
      originalUrl: "https://tokopedia.com/dummy-link",
      currentPrice: 13500000,
      isStockReady: true,
      isVerified: false,
      region: "Jakarta",
    },
  });

  await prisma.productLink.create({
    data: {
      productId: productS24.id,
      marketplace: MarketplaceType.WHATSAPP_LOKAL,
      storeName: "Bojonegoro Cell",
      originalUrl: "https://wa.me/6281234567890",
      currentPrice: 13700000, 
      isStockReady: true,
      isVerified: true, 
      region: "Bojonegoro",
    },
  });

  await prisma.priceHistory.createMany({
    data: [
      {
        productLinkId: linkTokped.id,
        price: 13800000,
        recordedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      {
        productLinkId: linkTokped.id,
        price: 13500000,
        recordedAt: new Date(),
      },
    ],
  });

  console.log("✅ Seed selesai! Login dengan: admin / password123");
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