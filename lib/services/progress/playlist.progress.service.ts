import Progress from "../../db/models/Progress.model";
import Resource from "../../db/models/Resource.model";
import { ProgressStatus } from "../../db/models/Progress.model";
import { updateProjectStats } from "../project.servise";

export const updatePlaylistProgress = async (
  userId: string,
  resourceId: string,
  videoId: string,
) => {
  if (!videoId) {
    throw new Error("videoId is required");
  }

  const resource = await Resource.findById(resourceId)
    .select("projectId videoCount")
    .exec();

  if (!resource) {
    throw new Error("Resource not found");
  }

  let progress = await Progress.findOne({
    userId,
    resourceId,
  }).exec();

  // Create progress if missing
  if (!progress) {
    progress = await Progress.create({
      userId,
      resourceId,
      projectId: resource.projectId,
      status: ProgressStatus.IN_PROGRESS,
      completedVideos: [videoId],
      startedAt: new Date(),
    });
  } else {
    // Avoid duplicates
    if (!progress.completedVideos.includes(videoId)) {
      progress.completedVideos.push(videoId);
    }
  }

  const videoCount = resource.videoCount || 0;

  if (videoCount > 0) {
    progress.progressPercentage = Math.min(
      100,
      Math.floor((progress.completedVideos.length / videoCount) * 100),
    );
  }

  const wasCompleted = progress.status === ProgressStatus.COMPLETED;

  if (!wasCompleted && progress.progressPercentage >= 95) {
    progress.status = ProgressStatus.COMPLETED;
    progress.completedAt = new Date();

    if (resource.projectId) {
      await updateProjectStats(resource.projectId, userId);
    }
  }

  progress.lastAccessedAt = new Date();

  await progress.save();

  return progress;
};
