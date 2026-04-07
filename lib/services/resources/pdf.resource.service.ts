import Resource from "@/lib/db/models/Resource.model";
import { uploadPdf } from "@/lib/utils/uploadPdf";
import { updateProjectStats } from "../project.servise";

type CreatePdfResourceData = {
  title: string;
  fileUrl: string; // ✅ changed from File → URL
};

export const createPdfResource = async (
  userId: string,
  projectId: string,
  data: CreatePdfResourceData,
) => {
  try {
    // ✅ Process PDF (pages + size)
    const upload = await uploadPdf(data.fileUrl);

    // ✅ Save resource
    const resource = await Resource.create({
      userId,
      projectId,
      title: data.title,
      type: "pdf",
      fileUrl: upload.url, // ✅ updated
      pdfData: {
        fileUrl: upload.url, // ✅ updated
        fileSize: upload.bytes,
        pageCount: upload.pages, // ✅ from pdf-parse
      },
      tags: [],
    });

    await updateProjectStats(projectId, userId);

    return resource;
  } catch (error) {
    console.error("Error creating PDF resource:", error);
    throw new Error("Failed to create PDF resource");
  }
};
