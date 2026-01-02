import { prisma } from "@/lib/prisma";
import SettingsForm from "./settings-form"; // Import Client Component tadi

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // 1. Fetch Data di Server
  const settings = await prisma.siteSetting.findFirst();

  if (!settings) {
    return <div className="p-8">Data not found. Please run seed.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-coffee">Website Settings</h1>
        <p className="text-gray-500">Kelola identitas dan tampilan utama website.</p>
      </div>

      {/* 2. Render Form Client Component & Pass Data */}
      <SettingsForm settings={settings} />
    </div>
  );
}