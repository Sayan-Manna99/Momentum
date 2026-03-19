import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import Resource, { ResourceType } from "@/lib/db/models/Resource.model";
import { updateProjectStats } from "../project.servise";

export const updateVideoProgress = async (
  userId: string,
  resourceId: string,
  position: number,
) => {
  const resource = await Resource.findById(resourceId)
    .select("projectId totalDuration")
    .exec();

  if (!resource) {
    throw new Error("Resource not found");
  }

  const totalDuration = Number(resource.totalDuration) || 0;
  const safePosition = Math.max(0, position ?? 0);

  let progress = await Progress.findOne({
    userId,
    resourceId,
  }).exec();

  // 🔥 CREATE CASE (FIXED)
  if (!progress) {
    const clampedPosition =
      totalDuration > 0 ? Math.min(safePosition, totalDuration) : safePosition;

    const progressPercentage =
      totalDuration > 0
        ? Math.min(100, Math.floor((clampedPosition / totalDuration) * 100))
        : 0;

    progress = await Progress.create({
      userId,
      resourceId,
      projectId: resource.projectId,
      resourceType: ResourceType.YOUTUBE_VIDEO,
      status: ProgressStatus.IN_PROGRESS,
      watchedDuration: clampedPosition,
      lastWatchedPosition: clampedPosition,
      progressPercentage, // ✅ FIX
      watchCount: 1,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });

    return progress;
  }

  // EXISTING CASE
  const prevPosition = progress.lastWatchedPosition;
  const newPosition = Math.max(prevPosition, safePosition);

  const clampedPosition =
    totalDuration > 0 ? Math.min(newPosition, totalDuration) : newPosition;

  progress.watchedDuration = clampedPosition;
  progress.lastWatchedPosition = clampedPosition;
  progress.lastAccessedAt = new Date();

  if (safePosition < prevPosition) {
    progress.watchCount += 1;
  }

  // ✅ ALWAYS calculate
  progress.progressPercentage =
    totalDuration > 0
      ? Math.min(100, Math.floor((clampedPosition / totalDuration) * 100))
      : 0;

  if (progress.progressPercentage >= 95 && !progress.completedAt) {
    progress.status = ProgressStatus.COMPLETED;
    progress.completedAt = new Date();

    if (resource.projectId) {
      await updateProjectStats(resource.projectId, userId);
    }
  } else {
    progress.status = ProgressStatus.IN_PROGRESS;
  }

  await progress.save();

  return progress;
};
