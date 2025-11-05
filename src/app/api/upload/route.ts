import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadMultipleImages } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "ethiopian-ecommerce";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files provided" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      return NextResponse.json(
        {
          message:
            "Invalid file types. Only JPEG, PNG, WebP, and GIF are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      return NextResponse.json(
        { message: "File size too large. Maximum size is 10MB per file." },
        { status: 400 }
      );
    }

    let uploadResults;

    if (files.length === 1) {
      const result = await uploadImage(files[0], folder);
      uploadResults = [result];
    } else {
      uploadResults = await uploadMultipleImages(files, folder);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadResults,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload files" },
      { status: 500 }
    );
  }
}
