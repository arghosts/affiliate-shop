// lib/imagekit.ts
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// ✅ PERBAIKAN: Folder default sekarang "/general", bukan "/jagopilih/general"
export async function uploadImage(file: File | Blob, folder: string = "/general") {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Bersihkan nama file dari spasi
  const cleanName = (file as File).name.replace(/\s/g, "-");
  const uniqueName = `img-${Date.now()}-${cleanName}`;

  const response = await imagekit.upload({
    file: buffer,
    fileName: uniqueName,
    folder: folder,       // Akan masuk ke folder yang ditentukan tanpa double prefix
    useUniqueFileName: false, 
  });
  
  // Ini akan mengembalikan URL bersih: https://ik.imagekit.io/ID/folder/nama-file.jpg
  return response.url;
}