import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import Resource from "@/lib/db/models/Resource.model";
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

  // Find existing progress
  let progress = await Progress.findOne({
    userId,
    resourceId,
  }).exec();

  // Create progress if it doesn't exist
  if (!progress) {
    progress = await Progress.create({
      userId,
      resourceId,
      projectId: resource.projectId,
      status: ProgressStatus.IN_PROGRESS,
      watchedDuration: position,
      lastWatchedPosition: position,
      watchCount: 1,
      startedAt: new Date(),
    });

    return progress;
  }

  // Prevent progress rollback
  const newPosition = Math.max(progress.lastWatchedPosition, position);

  const wasCompleted = progress.status === ProgressStatus.COMPLETED;

  progress.watchedDuration = newPosition;
  progress.lastWatchedPosition = newPosition;
  progress.lastAccessedAt = new Date();

  const totalDuration = resource.totalDuration || 0;

  // Calculate progress percentage
  if (totalDuration > 0) {
    progress.progressPercentage = Math.min(
      100,
      Math.floor((newPosition / totalDuration) * 100),
    );
  }

  // Detect completion
  if (!wasCompleted && progress.progressPercentage >= 95) {
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

// Reset progress of a resource for a user
export const resetProgress = async (userId: string, resourceId: string) => {
  const progress = await Progress.findOneAndUpdate(
    { userId, resourceId },
    {
      $set: {
        status: ProgressStatus.NOT_STARTED,
        watchedDuration: 0,
        lastWatchedPosition: 0,
        progressPercentage: 0,
        sessions: [],
        totalTimeSpent: 0,
        startedAt: null,
        completedAt: null,
      },
    },
    { new: true },
  ).exec();

  if (!progress) {
    throw new Error("Progress not found");
  }

  // Update project stats after reset
  const resource = await Resource.findById(resourceId)
    .select("projectId")
    .exec();

  if (resource?.projectId) {
    await updateProjectStats(resource.projectId, userId);
  }

  return progress;
};
