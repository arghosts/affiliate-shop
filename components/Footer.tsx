import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/config/site"; // Import dari file luar
import { ArrowUpRight } from "lucide-react";

export default async function Footer() {
  // 1. Fetch Settings & Categories secara paralel (biar cepat)
  const [settings, categories] = await prisma.$transaction([
    prisma.siteSetting.findFirst(),
    prisma.category.findMany({
      take: 5, // Ambil 5 kategori teratas
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true }
    })
  ]);

  const siteName = settings?.siteName ?? "JAGOPILIH";
  const footerText = settings?.footerAbout ?? "Membangun kemandirian digital.";

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-bg border-t border-coffee/5 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6">
        
        {/* --- TOP SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* KOLOM 1: BRAND IDENTITY (Lebar 4/12) */}
          <div className="lg:col-span-4 pr-8">
            <h3 className="text-2xl font-black text-coffee tracking-tighter mb-6 uppercase">
              {siteName}<span className="text-gold-accent">.</span>
            </h3>
            <p className="text-muted-brown font-medium leading-relaxed text-sm max-w-sm">
              {footerText}
            </p>
          </div>

          {/* KOLOM 2: DYNAMIC CATEGORIES (Lebar 2/12) */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-xs text-coffee uppercase tracking-widest mb-8">
              Explore
            </h4>
            <ul className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/?cat=${cat.slug}#products`} 
                      className="text-sm font-bold text-muted-brown hover:text-gold-accent transition-colors flex items-center gap-1 group"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400 italic">Belum ada kategori</li>
              )}
            </ul>
          </div>

          {/* KOLOM 3: SOCIALS DARI CONFIG (Lebar 3/12) */}
          <div className="lg:col-span-3">
            <h4 className="font-black text-xs text-coffee uppercase tracking-widest mb-8">
              Connect
            </h4>
            <div className="flex flex-col gap-4">
              {SOCIAL_LINKS.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-muted-brown hover:text-gold-accent transition-colors w-fit"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-coffee/10 flex items-center justify-center group-hover:border-gold-accent group-hover:bg-gold-accent group-hover:text-white transition-all">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-bold">{social.label}</span>
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* KOLOM 4: DISCLOSURE (Lebar 3/12) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl border border-coffee/5 shadow-sm">
              <h4 className="font-black text-xs text-coffee uppercase tracking-widest mb-4">
                Affiliate Disclosure
              </h4>
              <p className="text-[11px] text-muted-brown leading-relaxed font-medium">
                Kami berpartisipasi dalam program afiliasi. Pembelian melalui link kami mungkin memberikan komisi kecil tanpa biaya tambahan bagi Anda, yang mendukung kami untuk terus berkarya.
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
              © {currentYear} {siteName}. All Rights Reserved.
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