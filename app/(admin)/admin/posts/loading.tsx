import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    // Tampilan Center di tengah layar
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-coffee">
        <Loader2 className="h-10 w-10 animate-spin text-gold-accent" />
        <p className="text-sm font-bold animate-pulse">Sedang memuat data...</p>
      </div>
    </div>
  );
}