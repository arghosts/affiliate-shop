import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Bersihkan data lama
  await prisma.post.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Buat Kategori Dummy
  const catGadget = await prisma.category.create({
    data: { name: "Gadget", slug: "gadget" },
  });

  // 3. Buat Postingan Blog dengan Format JSON Editor.js
  await prisma.post.create({
    data: {
      title: "Review DJI Osmo Action 5 Pro",
      slug: "review-dji-osmo-action-5-pro",
      thumbnail: "https://images.unsplash.com/photo-1589255866164-3228a6f810df?auto=format&fit=crop&q=80&w=800",
      // 👇 INI YANG PENTING: Format JSON
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
              text: "Kamera aksi terbaru dari DJI ini benar-benar mengubah permainan vlogging malam hari. Sensornya yang besar mampu menangkap cahaya minim dengan sangat baik.",
            },
          },
          {
            id: "list1",
            type: "list",
            data: {
              style: "unordered",
              items: ["Baterai tahan 4 jam", "Layar OLED Ganda", "Harga Kompetitif"],
            },
          },
          {
            id: "header2",
            type: "header",
            data: { text: "Kesimpulan", level: 3 },
          },
          {
            id: "para2",
            type: "paragraph",
            data: {
              text: "Sangat recommended untuk konten kreator pemula maupun pro.",
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed berhasil! Database sudah terisi format JSON.");
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