import { PDFDocument } from "pdf-lib";

export const getPdfMetadata = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch PDF");
  }

  const buffer = await res.arrayBuffer();

  const pdfDoc = await PDFDocument.load(buffer);

  return {
    pages: pdfDoc.getPageCount(),
  };
};
