// ### app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toko Online Modern",
  description: "Ecommerce Stack V1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>
        {/* Layout utama hanya render children, tidak ada Navbar disini */}
        {children}
      </body>
    </html>
  );
}
