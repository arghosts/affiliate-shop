import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Fungsi standar untuk menggabungkan class Tailwind dengan aman
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}