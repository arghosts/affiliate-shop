// ### app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Atau font yang Anda pakai (Geist/Inter)
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // <--- WAJIB ADA. Teks langsung muncul (fallback) baru ganti font.
})

// 👇 INI YANG BENAR (Hanya boleh ada satu export const metadata)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://jagopilih.vercel.app"),
  
  title: {
    default: "JagoPilih - Rekomendasi Belanja Terbaik",
    template: "%s | JagoPilih",
  },
  description: "Belanja di marketplace tanpa zonk. Review jujur dan link affiliate terpercaya.",
  
  // Konfigurasi OpenGraph (untuk tampilan di WA/Twitter)
  openGraph: {
    title: "JagoPilih - Rekomendasi Belanja Terbaik",
    description: "Belanja di marketplace tanpa zonk.",
    url: "https://jagopilih.vercel.app",
    siteName: "JagoPilih",
    locale: "id_ID",
    type: "website",
  },
  
  // Konfigurasi Robots (agar di-index Google)
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-7RGiOQJeL8tIx9H0BLrHmgJGkttrut8lfjoMl-x3ag", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}{process.env.NODE_ENV !== 'development' && <SpeedInsights />} <Analytics /></body>
    </html>
  );
}