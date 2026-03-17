import Resource from "@/lib/db/models/Resource.model";
import { uploadPdf } from "@/lib/utils/uploadPdf";
import { PDFDocument } from "pdf-lib";

type CreatePdfResourceData = {
  title: string;
  file: File;
};

export const createPdfResource = async (
  userId: string,
  projectId: string,
  data: CreatePdfResourceData,
) => {
  try {
    // 1. Convert file to ArrayBuffer
    const arrayBuffer = await data.file.arrayBuffer();

    // 2. Extract page count using pdf-lib
    let totalPages = 1; // safe default

    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      totalPages = pdfDoc.getPageCount();
    } catch (error) {
      console.warn("Could not extract PDF page count:", error);
    }

    // 3. Upload PDF
    const upload = await uploadPdf(data.file);

    // 4. Save resource
    const resource = await Resource.create({
      userId,
      projectId,
      title: data.title,
      type: "pdf",
      pdfData: {
        cloudinaryUrl: upload.url,
        cloudinaryPublicId: upload.publicId,
        fileSize: upload.bytes,
        pageCount: totalPages,
      },
      tags: [],
    });

    return resource;
  } catch (error) {
    console.error("Error creating PDF resource:", error);
    throw new Error("Failed to create PDF resource");
  }
};
