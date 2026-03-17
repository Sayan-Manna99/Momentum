import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary/config";
import { Readable } from "stream";

export interface UploadedFile {
  url: string;
  publicId: string;
  bytes: number;
  pages: number;
}

export const uploadPdf = async (file: File): Promise<UploadedFile> => {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "momentum/pdfs",
        format: "pdf",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined,
      ) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Upload failed: no result returned"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          pages: result.pages ?? 0,
        });
      },
    );

    // ✅ Convert buffer to readable stream and pipe it
    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};
