import { getPdfMetadata } from "./pdfMetadata";

export interface UploadedFile {
  url: string;
  pages: number;
  bytes: number;
}

export const uploadPdf = async (fileUrl: string): Promise<UploadedFile> => {
  try {
   
    const res = await fetch(fileUrl);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

   
    const data = await getPdfMetadata(fileUrl);

    return {
      url: fileUrl,
      pages: data.pages,
      bytes: buffer.length,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    throw new Error("Failed to process PDF");
  }
};

