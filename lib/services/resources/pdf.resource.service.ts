import Resource from "@/lib/db/models/Resource.model";
import { uploadPdf } from "@/lib/utils/uploadPdf";

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
     const upload = await uploadPdf(data.file);

     const resource = await Resource.create({
       userId,
       projectId,
       title: data.title,
       type: "pdf",
       pdfData: {
         cloudinaryUrl: upload.url,
         cloudinaryPublicId: upload.publicId,
         fileSize: upload.bytes,
         pageCount: 0,
       },
       tags: [],
     });

     return resource;
  } catch (error) {
    console.error("Error creating PDF resource:", error);
    throw new Error("Failed to create PDF resource");
  }
};
