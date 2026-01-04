// ### app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Atau font yang Anda pakai (Geist/Inter)
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Sesuaikan dengan font Anda

// 👇 INI YANG BENAR (Hanya boleh ada satu export const metadata)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://jagopilih.vercel.app"),
  
  title: {
    default: "JagoPilih - Rekomendasi Gadget Terbaik",
    template: "%s | JagoPilih",
  },
  description: "Temukan gadget terbaik dengan harga termurah. Review jujur dan link affiliate terpercaya.",
  
  // Konfigurasi OpenGraph (untuk tampilan di WA/Twitter)
  openGraph: {
    title: "JagoPilih - Rekomendasi Gadget Terbaik",
    description: "Temukan gadget impian dengan harga terbaik.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}