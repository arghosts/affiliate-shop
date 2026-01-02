// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning database...')
  
  // 1. CLEANUP (Urutan penting! Hapus relasi Child dulu)
  await prisma.navbarLink.deleteMany() // Jika ada error typo di schema, sesuaikan nama modelnya (NavbarLink vs NavBarLink)
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany() // Produk dihapus sebelum Category/Tag
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.admin.deleteMany()
  // SiteSetting biasanya tidak dihapus, tapi di-upsert.

  console.log('🌱 Starting seeding...')

  // 2. SEED ADMIN
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      password: hashedPassword,
    },
  })

  // 3. SEED SITE SETTINGS
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: "TechReview.ID",
      heroTitle: "Terbang Lebih Tinggi.",
      heroPromo: "Best Drone 2024",
      heroDescription: "Review jujur tanpa basa-basi.",
      primaryBtnText: "Lihat Katalog",
      primaryBtnLink: "#products",
      secondaryBtnText: "Tentang Kami",
      secondaryBtnLink: "/about",
    },
  })

  // 4. SEED CATEGORIES
  const catGear = await prisma.category.create({
    data: { name: 'Field Gear', slug: 'field-gear' }
  })
  
  const catStudio = await prisma.category.create({
    data: { name: 'Studio Setup', slug: 'studio-setup' }
  })

  // 5. SEED TAGS
  const tagBest = await prisma.tag.create({
    data: { name: 'Best Value', slug: 'best-value' }
  })
  
  const tagPro = await prisma.tag.create({
    data: { name: 'Professional', slug: 'professional' }
  })

  // 6. SEED PRODUCTS
  await prisma.product.create({
    data: {
      name: 'DJI Mavic 3 Pro',
      slug: 'dji-mavic-3-pro',
      description: 'Drone flagship dengan triple-camera system.',
      price: 24999000,
      categoryId: catGear.id, // Connect Category
      tags: {
        connect: [{ id: tagPro.id }, { id: tagBest.id }] // Connect Tags
      },
      pros: 'Kamera 5.1K,Sensor Besar,O3+ Transmission',
      cons: 'Harga Tinggi,Body Besar',
      images: {
        create: [{ url: '/dji5pro.png' }] // Pastikan file ini ada di folder public/
      }
    }
  })

  console.log('✅ Seeding finished.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })