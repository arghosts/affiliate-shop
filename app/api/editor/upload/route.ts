// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: 0, message: "No file uploaded" });
    }

    // ✅ PERBAIKAN: Langsung ke folder "/blog-content"
    const url = await uploadImage(file as File, "/blog-content");

    return NextResponse.json({
      success: 1,
      file: {
        url: url,
      },
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: 0, message: "Upload failed" });
  }
}