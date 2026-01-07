// ### next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "down-id.img.susercontent.com", // Shopee Image CDN
      },
      {
        protocol: "https",
        hostname: "cf.shopee.co.id", // Shopee Legacy CDN
      },
      {
        protocol: "https",
        hostname: "images.tokopedia.net", // Tokopedia Image CDN
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Useful for placeholders
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/jagopilih/**', // Allow only your folder
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;