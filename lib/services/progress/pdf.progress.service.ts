import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import { updateProjectStats } from "../project.servise";
import Resource from "@/lib/db/models/Resource.model";
import { ResourceType } from "@/lib/db/models/Resource.model";

export const updatePdfProgress = async (
  userId: string,
  resourceId: string,
  data: PdfProgressInput
) => {
  try {
    // 1. Get resource (for total pages)
    const resource = await Resource.findById(resourceId)
      .select("pdfData projectId")
      .lean();

    if (!resource || !resource.pdfData?.pageCount) {
      throw new Error("Invalid PDF resource");
    }

    const totalPages = Math.max(resource.pdfData.pageCount, 1); // Avoid division by zero
    // 2. Get or create progress
    let progress = await Progress.findOne({ userId, resourceId });
     if (!progress) {
       progress = await Progress.create({
         userId,
         resourceId,
         projectId: resource.projectId,
         resourceType: ResourceType.PDF,
          status: ProgressStatus.IN_PROGRESS,
         pagesRead: 0,
         lastPageRead: 0,
       });
     }
      // 3. Prevent invalid input
  const safePagesRead = Math.max(0, data.pagesRead);
   const safeLastPage = Math.min(
  Math.max(0, data.lastPageRead),
  totalPages
);

  // 4. Prevent rollback
  progress.pagesRead = Math.max(progress.pagesRead, safePagesRead);

  // 5. Clamp to total pages
  progress.pagesRead = Math.min(progress.pagesRead, totalPages);

  // 6. Update last page freely
  progress.lastPageRead = safeLastPage;

  // 7. Calculate percentage
  progress.progressPercentage =
    (progress.pagesRead / totalPages) * 100;


    
  // 8. Update status

   if (!progress.startedAt) {
     progress.startedAt = new Date();
   }
  if (progress.progressPercentage >= 95) {
    progress.status = ProgressStatus.COMPLETED;

    if (!progress.completedAt) {
      progress.completedAt = new Date();
    }
  } else {
    progress.status = ProgressStatus.IN_PROGRESS;
  }

  // 9. Update timestamps
  progress.lastAccessedAt = new Date();

  // 10. Save
  await progress.save();

  // 11. Update project stats
  if (resource.projectId) {
    await updateProjectStats(resource.projectId, userId);
  }

  return progress;
}
  catch (error:unknown) {
    if (error instanceof Error) {
      console.error("Error updating PDF progress:", error.message);
      throw new Error("Failed to update PDF progress");
    } else {
      console.error("Unknown error updating PDF progress:", error);
      throw new Error("Failed to update PDF progress");
    }
  }


};