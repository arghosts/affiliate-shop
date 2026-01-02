import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Facebook, Instagram, Twitter, ArrowUpRight, Youtube } from "lucide-react";

export default async function Footer() {
  // Fetch data dinamis untuk Identitas Site
  const settings = await prisma.siteSetting.findFirst();
  const siteName = settings?.siteName ?? "JAGOPILIH";
  const footerText = settings?.footerAbout ?? "Membangun setup produktivitas dan gear vlogging terbaik dengan review jujur.";

  return (
    <footer className="bg-warm-bg border-t border-coffee/5 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6">
        
        {/* --- TOP SECTION (GRID 4 KOLOM) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* KOLOM 1: BRAND IDENTITY (Lebar 4/12) */}
          <div className="lg:col-span-4 pr-8">
            <h3 className="text-2xl font-black text-coffee tracking-tighter mb-6 uppercase">
              {siteName}<span className="text-gold-accent">.COM</span>
            </h3>
            <p className="text-muted-brown font-medium leading-relaxed text-sm max-w-sm">
              {footerText}
            </p>
          </div>

          {/* KOLOM 2: CATEGORIES (Lebar 2/12) */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[10px] text-coffee uppercase tracking-[0.2em] mb-8">
              Categories
            </h4>
            <ul className="space-y-4">
              {/* Link Statis untuk Layout (Nanti bisa didinamiskan jika perlu) */}
              <li>
                <Link href="#" className="group flex items-center gap-1 text-sm font-bold text-muted-brown hover:text-gold-accent transition-colors">
                  Field Gear 
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="#" className="group flex items-center gap-1 text-sm font-bold text-muted-brown hover:text-gold-accent transition-colors">
                  Studio Setup
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="#" className="group flex items-center gap-1 text-sm font-bold text-muted-brown hover:text-gold-accent transition-colors">
                  Workspace
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: CONNECT (Lebar 2/12) */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[10px] text-coffee uppercase tracking-[0.2em] mb-8">
              Connect
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-brown hover:text-gold-accent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-brown hover:text-gold-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-brown hover:text-gold-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* KOLOM 4: DISCLAIMER BOX (Lebar 4/12) */}
          <div className="lg:col-span-4">
            <div className="bg-surface/50 p-8 rounded-2xl border border-surface">
              <h4 className="font-black text-[10px] text-coffee uppercase tracking-[0.2em] mb-4">
                Affiliate Disclosure
              </h4>
              <p className="text-xs text-muted-brown/80 leading-relaxed font-medium">
                Sebagai bagian dari program afiliasi, kami mendapatkan komisi kecil dari pembelian 
                yang dilakukan melalui link di situs ini tanpa biaya tambahan bagi Anda. 
                Hal ini membantu kami tetap independen dalam memberikan review.
              </p>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION (COPYRIGHT & LEGAL) --- */}
        <div className="border-t border-coffee/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-coffee rounded-full flex items-center justify-center text-warm-bg text-xs font-bold">
               {siteName.charAt(0)}
            </div>
            <p className="text-[10px] font-bold text-coffee uppercase tracking-wider">
              © {new Date().getFullYear()} {siteName} Journal. All Rights Reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[10px] font-bold text-muted-brown uppercase tracking-wider hover:text-gold-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] font-bold text-muted-brown uppercase tracking-wider hover:text-gold-accent">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}