"use client";

import { useActionState, useEffect } from "react";
import { updateSettings } from "./actions"; // Import action dari file terpisah
import { Save, Globe, Image as ImageIcon, LayoutTemplate, Loader2 } from "lucide-react";
import { motion } from "framer-motion"; // Untuk animasi tombol
import toast from "react-hot-toast";    // Untuk notifikasi

// Tipe data props untuk initial data form
interface SettingsFormProps {
  settings: any; // Sebaiknya pakai type Prisma yang proper, tapi any ok untuk skrg
}

const initialState = {
  status: "",
  message: "",
};

export default function SettingsForm({ settings }: SettingsFormProps) {
  // Hook baru React 19 / Next 15+ untuk handle form state
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);

  // Efek samping: Munculkan Toast saat state berubah (selesai submit)
  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message, {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    } else if (state?.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="id" value={settings.id} />

      {/* --- SECTION 1 --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Globe className="w-5 h-5 text-gold-accent" />
          <h3 className="text-lg font-bold text-coffee">Identitas Website</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-admin">Nama Website (Navbar)</label>
            <input name="siteName" defaultValue={settings.siteName} className="input-admin" placeholder="Contoh: TechReview" />
          </div>
          <div className="md:col-span-2">
            <label className="label-admin">Tentang Kami (Footer Kiri)</label>
            <textarea name="footerAbout" defaultValue={settings.footerAbout} className="input-admin h-24" />
          </div>
        </div>
      </div>

      {/* --- SECTION 2 --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <ImageIcon className="w-5 h-5 text-gold-accent" />
          <h3 className="text-lg font-bold text-coffee">Tampilan Hero</h3>
        </div>
        <div>
          <label className="label-admin">URL Gambar Hero (Opsional)</label>
          <input name="heroImage" defaultValue={settings.heroImage || ""} className="input-admin" />
          <p className="text-xs text-gray-400 mt-2 italic">*Biarkan kosong untuk animasi abstrak.</p>
        </div>
      </div>

      {/* --- SECTION 3 --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <LayoutTemplate className="w-5 h-5 text-gold-accent" />
          <h3 className="text-lg font-bold text-coffee">Konten Teks Hero</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-admin">Judul Utama</label>
            <input name="heroTitle" defaultValue={settings.heroTitle} className="input-admin" />
          </div>
          <div>
            <label className="label-admin">Teks Promo</label>
            <input name="heroPromo" defaultValue={settings.heroPromo} className="input-admin" />
          </div>
          <div>
            <label className="label-admin">Deskripsi</label>
            <textarea name="heroDescription" defaultValue={settings.heroDescription} className="input-admin h-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="label-admin">Tombol Utama</label>
            <input name="primaryBtnText" defaultValue={settings.primaryBtnText} className="input-admin mb-2" />
            <input name="primaryBtnLink" defaultValue={settings.primaryBtnLink} className="input-admin" />
          </div>
          <div>
            <label className="label-admin">Tombol Sekunder</label>
            <input name="secondaryBtnText" defaultValue={settings.secondaryBtnText} className="input-admin mb-2" />
            <input name="secondaryBtnLink" defaultValue={settings.secondaryBtnLink} className="input-admin" />
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTON (FIXED ANIMATION) --- */}
      <div className="flex justify-end sticky bottom-8 z-50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }} // Efek "Mendelep" saat dipencet
          type="submit"
          disabled={isPending}
          className="bg-gold-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-gold-accent/20 hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Simpan Semua
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}