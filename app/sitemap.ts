import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jagopilih.vercel.app";

  // 1. Ambil semua produk
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  // 2. Ambil semua blog posts
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
  });

  // 3. Mapping Produk ke format Sitemap
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 4. Mapping Blog ke format Sitemap
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 5. Gabungkan dengan halaman statis (Home, Blog Index)
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
    ...postUrls,
  ];
}