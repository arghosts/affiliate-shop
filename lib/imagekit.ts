// lib/imagekit.ts
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// Helper function upload fleksibel
export async function uploadImage(file: File | Blob, folder: string = "/jagopilih/general") {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Bikin nama file unik
  const cleanName = (file as File).name.replace(/\s/g, "-");
  const uniqueName = `img-${Date.now()}-${cleanName}`;

  const response = await imagekit.upload({
    file: buffer,
    fileName: uniqueName, // Generate nama otomatis
    folder: folder,       // Folder dinamis
    useUniqueFileName: false, 
  });
  
  return response.url;
}