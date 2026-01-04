"use client";

import { useState } from "react";
import * as XLSX from "xlsx"; // Library pembaca excel
import { importProducts } from "./actions";
import { Upload, Loader2, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    const reader = new FileReader();
    
    // Saat file selesai dibaca
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        
        // Ambil Sheet pertama
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Ubah Excel jadi JSON Array
        const data = XLSX.utils.sheet_to_json(ws);

        // 👇 PERBAIKAN DISINI: Cuci data agar jadi "Plain Object"
        // Teknik ini membuang semua metadata aneh dari library xlsx
        const cleanData = JSON.parse(JSON.stringify(data));

        // Kirim ke Server Action
        const result = await importProducts(cleanData);

        if (result.success) {
          setStatus({ type: "success", msg: result.message });
          // Reset input file jika perlu
        } else {
          setStatus({ type: "error", msg: result.message });
        }
      } catch (err) {
        console.error(err);
        setStatus({ type: "error", msg: "Gagal membaca file Excel." });
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Import Produk (Excel)</h1>
        <p className="text-gray-500">Upload file .xlsx atau .csv untuk input data massal.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-50 p-4 rounded-full">
            <FileSpreadsheet className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <label className="block w-full cursor-pointer">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            disabled={loading}
            className="hidden" 
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:bg-gray-50 transition-colors">
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                <p className="text-gray-600">Sedang memproses data...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-lg font-medium text-gray-700">Klik untuk Upload Excel</span>
                <span className="text-sm text-gray-400 mt-1">Pastikan format kolom sesuai</span>
              </div>
            )}
          </div>
        </label>

        {/* Status Message */}
        {status.msg && (
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
            status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium">{status.msg}</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2 text-sm">💡 Tips Format Excel:</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Pastikan header kolom (baris 1) sama persis dengan database (name, price, categoryId, dll).</li>
          <li>Kolom <strong>categoryId</strong> cukup diisi Nama Kategorinya (misal: "Smartphone"). Sistem akan otomatis mencari/membuatnya.</li>
          <li>Kolom <strong>isFeatured</strong> isi dengan TRUE atau FALSE.</li>
        </ul>
      </div>
    </div>
  );
}