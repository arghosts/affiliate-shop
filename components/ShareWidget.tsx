"use client";

import { SOCIAL_PLATFORMS } from "@/lib/social-share";
import { Link2, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareWidgetProps {
  title: string;
  slug: string;
}

export default function ShareWidget({ title, slug }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);
  
  // Tentukan Base URL (Ganti domain asli saat production)
  // Saat dev: http://localhost:3000
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const fullUrl = `${baseUrl}/blog/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (urlGenerator: (u: string, t: string) => string) => {
    const shareUrl = urlGenerator(fullUrl, title);
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-orange-500" /> Bagikan Artikel
      </h1>
      
      <div className="flex flex-col gap-3">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.getShareUrl)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all shadow-md shadow-gray-200 transform hover:-translate-y-1 ${platform.color}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">Share ke {platform.name}</span>
            </button>
          );
        })}

        {/* Tombol Copy Link Manual */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all border border-gray-200"
        >
          <Link2 className="w-5 h-5" />
          <span className="font-medium text-sm">
            {copied ? "Link Tersalin!" : "Salin Link"}
          </span>
        </button>
      </div>
    </div>
  );
}