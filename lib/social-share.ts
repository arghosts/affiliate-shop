import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from "lucide-react";

// Definisikan tipe data untuk tombol share
export type SocialPlatform = {
  name: string;
  icon: any; // Lucide Icon
  color: string; // Warna khas medsos (Tailwind class atau Hex)
  getShareUrl: (url: string, title: string) => string;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500 hover:bg-green-600",
    getShareUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600 hover:bg-blue-700",
    getShareUrl: (url, _) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Twitter / X",
    icon: Twitter,
    color: "bg-black hover:bg-gray-800",
    getShareUrl: (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700 hover:bg-blue-800",
    getShareUrl: (url, _) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];