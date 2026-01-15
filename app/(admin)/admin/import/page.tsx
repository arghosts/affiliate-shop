"use client";

import { useState } from "react";
import * as XLSX from "xlsx"; 
import { importProducts } from "./actions";
import { Upload, Loader2, FileSpreadsheet, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    const reader = new FileReader();
    
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(ws);

        // Sanitasi Data Awal (Hapus row kosong)
        const rawData = data.filter((row: any) => 
           row && Object.keys(row).length > 0
        );
        const cleanData = JSON.parse(JSON.stringify(rawData));

        // Kirim ke Server Action
        const result = await importProducts(cleanData);

        if (result.success) {
           setStatus({ type: "success", msg: result.message });
        } else {
           setStatus({ type: "error", msg: result.message });
        }

      } catch (err) {
        console.error(err);
        setStatus({ type: "error", msg: "Gagal membaca file Excel. Pastikan format valid." });
      } finally {
        setLoading(false);
        // Reset input value agar bisa upload file yang sama jika perlu
        e.target.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FileSpreadsheet className="text-green-600" /> Import Produk (Excel)
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        
        {/* Upload Area */}
        <label className={`block w-full border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all ${loading ? 'bg-gray-50 border-gray-300' : 'border-blue-200 hover:bg-blue-50 hover:border-blue-400'}`}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={loading} className="hidden" />
          
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                <span className="text-gray-500 font-medium">Sedang memproses data...</span>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-blue-500 mb-3" />
                <span className="text-xl font-bold text-gray-700">Klik untuk Upload Excel</span>
                <span className="text-sm text-gray-400 mt-2">Format .xlsx atau .xls</span>
              </div>
            )}
          </div>
        </label>

        {/* Status Message */}
        {status.msg && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-left ${
            status.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {status.type === "success" ? <CheckCircle className="flex-shrink-0" size={20} /> : <AlertCircle className="flex-shrink-0" size={20} />}
            <p className="font-medium text-sm">{status.msg}</p>
          </div>
        )}
      </div>

      {/* Panduan Format Excel */}
      <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
           <Info className="w-5 h-5" /> Panduan Format Kolom Excel
        </h3>
        
        <div className="space-y-6 text-sm text-blue-800">
            <div>
                <p className="font-bold mb-1">1. Kolom Data Produk (Wajib):</p>
                <code className="bg-white px-2 py-1 rounded border border-blue-200 text-xs">name</code>, 
                <code className="bg-white px-2 py-1 rounded border border-blue-200 text-xs ml-1">category</code>, 
                <code className="bg-white px-2 py-1 rounded border border-blue-200 text-xs ml-1">description</code>, 
                <code className="bg-white px-2 py-1 rounded border border-blue-200 text-xs ml-1">images</code> (pisahkan koma),
                <code className="bg-white px-2 py-1 rounded border border-blue-200 text-xs ml-1">pros</code>,
                <code className="bg-white px-2 py-1 rounded border border-blue-200 text-xs ml-1">cons</code>
            </div>

            <div>
                <p className="font-bold mb-1">2. Kolom Link Marketplace (Opsional):</p>
                <p className="mb-2 text-xs opacity-80">Gunakan prefix: <span className="font-mono font-bold">shopee, tokped, tiktok, wa, website</span></p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <span className="font-bold text-xs uppercase text-orange-600 block mb-1">Shopee</span>
                        <div className="flex flex-wrap gap-1">
                            <code className="text-[10px] bg-gray-100 px-1 rounded">shopee_url</code>
                            <code className="text-[10px] bg-gray-100 px-1 rounded">shopee_price</code>
                            <code className="text-[10px] bg-gray-100 px-1 rounded">shopee_affiliate</code>
                            <code className="text-[10px] bg-gray-100 px-1 rounded">shopee_store</code>
                        </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <span className="font-bold text-xs uppercase text-green-600 block mb-1">Tokopedia</span>
                        <div className="flex flex-wrap gap-1">
                            <code className="text-[10px] bg-gray-100 px-1 rounded">tokped_url</code>
                            <code className="text-[10px] bg-gray-100 px-1 rounded">tokped_price</code>
                            <code className="text-[10px] bg-gray-100 px-1 rounded">tokped_affiliate</code>
                            <code className="text-[10px] bg-gray-100 px-1 rounded">tokped_store</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-xs text-blue-600 italic">
                * Tips: Penulisan header kolom tidak case-sensitive (boleh huruf besar/kecil). Spasi akan otomatis diganti underscore.
            </div>
        </div>
      </div>
    </div>
  );
}