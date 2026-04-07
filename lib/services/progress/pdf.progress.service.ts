import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import { updateProjectStats } from "../project.servise";
import Resource, { ResourceType } from "@/lib/db/models/Resource.model";

export const updatePdfProgress = async (
  userId: string,
  resourceId: string,
  data: PdfProgressInput,
) => {
  try {
    // 🔥 1. Validate input
    if (typeof data.currentPage !== "number") {
      throw new Error("currentPage is required");
    }

    // 🔥 2. Get resource
    const resource = await Resource.findById(resourceId)
      .select("pdfData projectId")
      .lean()
      .exec();

    if (!resource || !resource.pdfData?.pageCount) {
      throw new Error("Invalid PDF resource");
    }

    const totalPages = Math.max(resource.pdfData.pageCount, 1);

    // 🔥 3. Normalize current page
    const currentPage = Math.min(Math.max(1, data.currentPage), totalPages);

    // 🔥 4. Get or create progress
    let progress = await Progress.findOne({ userId, resourceId }).exec();

    if (!progress) {
      progress = await Progress.create({
        userId,
        resourceId,
        projectId: resource.projectId,
        resourceType: ResourceType.PDF,
        status: ProgressStatus.IN_PROGRESS,
        pagesRead: currentPage,
        lastPageRead: currentPage,
        progressPercentage: Math.floor((currentPage / totalPages) * 100),
        startedAt: new Date(),
        lastAccessedAt: new Date(),
      });

      if (resource.projectId) {
        await updateProjectStats(resource.projectId, userId);
      }

      return progress;
    }

    // 🔥 5. Prevent rollback
    const previousPagesRead = progress.pagesRead || 0;
    const newPagesRead = Math.max(previousPagesRead, currentPage);

    progress.pagesRead = Math.min(newPagesRead, totalPages);

    // 🔥 6. Always update last visited page
    progress.lastPageRead = currentPage;

    // 🔥 7. Calculate percentage
    progress.progressPercentage = Math.floor(
      (progress.pagesRead / totalPages) * 100,
    );

    // 🔥 8. Status logic
    if (!progress.startedAt && progress.pagesRead > 0) {
      progress.startedAt = new Date();
    }

    if (progress.progressPercentage >= 95) {
      progress.status = ProgressStatus.COMPLETED;

      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    } else {
      progress.status =
        progress.progressPercentage > 0
          ? ProgressStatus.IN_PROGRESS
          : ProgressStatus.NOT_STARTED;
    }

    // 🔥 9. Timestamp
    progress.lastAccessedAt = new Date();

    // 🔥 10. Save
    await progress.save();

    // 🔥 11. Update project stats
    if (resource.projectId) {
      await updateProjectStats(resource.projectId, userId);
    }

    return progress;
  } catch (error: unknown) {
    console.error("Error updating PDF progress:", error);
    throw new Error("Failed to update PDF progress");
  }
};
