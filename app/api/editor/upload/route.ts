import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/imagekit"; // Reuse helper ImageKit kamu

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image"); // Editor.js kirim field bernama 'image'

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: 0, message: "No file uploaded" });
    }

    // 1. Upload ke ImageKit (Folder blog)
    const url = await uploadImage(file as File, "/jagopilih/blog-content");

    // 2. Return format WAJIB sesuai aturan Editor.js
    return NextResponse.json({
      success: 1,
      file: {
        url: url, // URL dari ImageKit
      },
    });

  } catch (error) {
    return NextResponse.json({ success: 0, message: "Upload failed" });
  }
}