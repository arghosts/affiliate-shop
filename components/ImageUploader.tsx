"use client";

import { useState } from "react";
import { uploadImage } from "@/app/actions";

export default function ImageUploader() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await uploadImage(formData);
    setLoading(false);

    if (result.success && result.url) {
      setUrl(result.url);
      console.log("Uploaded to:", result.url);
    } else {
      alert("Upload failed");
    }
  }

  return (
    <div className="p-4 border rounded bg-gray-50 max-w-md">
      <h3 className="font-bold mb-4">Test Image Pipeline</h3>
      
      <form action={handleSubmit} className="flex flex-col gap-4">
        <input type="file" name="file" accept="image/*" required />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload to Cloud"}
        </button>
      </form>

      {url && (
        <div className="mt-4">
          <p className="text-green-600 text-sm mb-2">✅ Success! Hosted at:</p>
          <a href={url} target="_blank" className="text-blue-500 text-xs break-all">{url}</a>
          {/* ImageKit Transformation Example: Resize to 300px width */}
          <img src={`${url}?tr=w-300`} alt="Uploaded" className="mt-2 rounded border" />
        </div>
      )}
    </div>
  );
}