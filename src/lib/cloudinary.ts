import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: File | Buffer,
  folder: string = "ethiopian-ecommerce"
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file as any, {
      folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

export async function uploadMultipleImages(
  files: (File | Buffer)[],
  folder: string = "ethiopian-ecommerce"
): Promise<UploadResult[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Multiple image upload error:", error);
    throw new Error("Failed to upload images");
  }
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  let url = cloudinary.url(publicId, {
    quality,
    fetch_format: format,
  });

  if (width || height) {
    url = cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: format,
    });
  }

  return url;
}
