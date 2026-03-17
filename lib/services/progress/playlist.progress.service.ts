import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import Resource from "@/lib/db/models/Resource.model";
import { ResourceType } from "@/lib/db/models/Resource.model";
import { updateProjectStats } from "../project.servise";

export const updatePlaylistProgress = async (
  userId: string,
  resourceId: string,
  data: PlaylistProgressInput,
) => {
  try {
    // 1. Get resource (for projectId)
    const resource = await Resource.findById(resourceId)
      .select("projectId")
      .lean();

    if (!resource) {
      throw new Error("Playlist resource not found");
    }

    // 2. Get or create progress
    let progress = await Progress.findOne({ userId, resourceId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        resourceId,
        projectId: resource.projectId,
        resourceType: ResourceType.YOUTUBE_PLAYLIST,
        videoProgress: [],
      });
    }

    // 3. Find video in array
    let video = progress.videoProgress.find((v: typeof progress.videoProgress[0]) => v.videoId === data.videoId);

    // 4. If not exists → create
    if (!video) {
      video = {
        videoId: data.videoId,
        duration: data.duration,
        watchedDuration: 0,
        lastPosition: 0,
        completed: false,
        lastWatchedAt: new Date(),
      };

      progress.videoProgress.push(video);
    }

    // 5. Safe inputs
    const safePosition = Math.max(0, data.position);

    // 6. Prevent rollback
    video.watchedDuration = Math.max(video.watchedDuration, safePosition);

    // 7. Clamp to duration
    video.watchedDuration = Math.min(video.watchedDuration, video.duration);

    // 8. Update last position
    video.lastPosition = safePosition;
    video.lastWatchedAt = new Date();

    // 9. Completion logic per video
    if (video.watchedDuration / video.duration >= 0.95) {
      video.completed = true;
    }

    // 10. Recalculate playlist progress
    const totalDuration = progress.videoProgress.reduce(
      (acc: number, v: VideoProgressItem) => acc + v.duration,
      0,
    );

    const totalWatched = progress.videoProgress.reduce(
      (acc:number, v:VideoProgressItem) => acc + v.watchedDuration,
      0,
    );

    progress.progressPercentage =
      totalDuration > 0 ? (totalWatched / totalDuration) * 100 : 0;

    // 11. Status
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

    // 12. Timestamp
    progress.lastAccessedAt = new Date();

    // 13. Save
    await progress.save();

    // 14. Update project stats
    if (resource.projectId) {
      await updateProjectStats(resource.projectId, userId);
    }

    return progress;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating playlist progress:", error.message);
      throw new Error("Failed to update playlist progress");
    } else {
      console.error("Unknown error updating playlist progress:", error);
      throw new Error("Failed to update playlist progress");
    }
  }
};
