"use client";

import { useState } from "react";
import { uploadImage } from "@/app/actions"; // Ensure this path is correct

export default function ImageKitTestPage() {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [debugLog, setDebugLog] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    setStatus("uploading");
    setDebugLog("Initiating upload sequence...");

    try {
      const res = await uploadImage(formData);

      if (res.success && res.url) {
        setStatus("success");
        setResult({ url: res.url, name: (formData.get("file") as File).name });
        setDebugLog(`Upload Complete. \nURL: ${res.url}`);
      } else {
        setStatus("error");
        setDebugLog(`Error: ${res.error || "Unknown error occurred"}`);
      }
    } catch (e) {
      setStatus("error");
      setDebugLog(`System Crash: ${e}`);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-slate-800">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-900">
          SYSTEM UTILITY: <span className="text-blue-600">IMAGEKIT PIPELINE</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Diagnostics for ImageKit API integration and storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Panel: Input */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="font-bold mb-4 text-sm uppercase text-slate-400">Input Source</h2>
          <form action={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition">
              <input 
                type="file" 
                name="file" 
                accept="image/*" 
                required 
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "
              />
            </div>
            <button 
              type="submit" 
              disabled={status === "uploading"}
              className="w-full bg-slate-900 text-white py-3 rounded hover:bg-slate-800 disabled:opacity-50 font-medium transition-all"
            >
              {status === "uploading" ? "UPLOADING..." : "EXECUTE UPLOAD"}
            </button>
          </form>
        </div>

        {/* Right Panel: Output */}
        <div className="bg-slate-50 p-6 border rounded-lg">
          <h2 className="font-bold mb-4 text-sm uppercase text-slate-400">System Log</h2>
          
          {/* Console Output */}
          <div className="bg-black rounded p-4 font-mono text-xs text-green-400 min-h-[100px] overflow-auto mb-4">
            <p className="opacity-50">// System Ready</p>
            {status !== "idle" && <p> {status.toUpperCase()}</p>}
            {debugLog && <p className="whitespace-pre-wrap"> {debugLog}</p>}
          </div>

          {/* Visual Confirmation */}
          {status === "success" && result && (
            <div className="space-y-2 animate-in fade-in duration-500">
              <div className="text-xs font-bold text-slate-500">VISUAL CONFIRMATION:</div>
              <div className="relative aspect-video bg-slate-200 rounded overflow-hidden border">
                {/* We verify transformations here too */}
                <img 
                  src={`${result.url}?tr=w-400`} 
                  alt="Proof" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-[10px] text-slate-400 break-all">
                SRC: {result.url}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}