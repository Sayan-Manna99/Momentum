import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import Resource, { ResourceType } from "@/lib/db/models/Resource.model";
import { updateProjectStats } from "../project.servise";
import { extractYoutubeData } from "@/lib/utils/youTube"; // ✅ ADD

export const updatePlaylistProgress = async (
  userId: string,
  resourceId: string,
  data: PlaylistProgressInput,
) => {
  try {
    // ✅ 0. VALIDATION (CRITICAL)
    if (!data.videoId) {
      throw new Error("videoId is required");
    }

    if (data.position === undefined) {
      throw new Error("position is required");
    }

    // ✅ 1. Extract clean videoId
    const extracted = extractYoutubeData(data.videoId);
    const videoId = extracted?.videoId || data.videoId;

    if (!videoId) {
      throw new Error("Invalid videoId");
    }

    // 2. Get resource
    const resource = await Resource.findById(resourceId)
      .select("projectId")
      .lean()
      .exec();

    if (!resource) {
      throw new Error("Playlist resource not found");
    }

    // 3. Get or create progress
    let progress = await Progress.findOne({ userId, resourceId }).exec();

    if (!progress) {
      progress = await Progress.create({
        userId,
        resourceId,
        projectId: resource.projectId,
        resourceType: ResourceType.YOUTUBE_PLAYLIST,
        videoProgress: [],
      });
    }

    // 4. Find video
    let video = progress.videoProgress.find(
      (v: VideoProgressItem) => v.videoId === videoId,
    );

    // 5. Create if not exists
    if (!video) {
      video = {
        videoId,
        duration: data.duration ?? 0,
        watchedDuration: 0,
        lastPosition: 0,
        completed: false,
        lastWatchedAt: new Date(),
      };

      progress.videoProgress.push(video as VideoProgressItem);
    }

    // ✅ 6. Safe position (NOW GUARANTEED)
    const safePosition = Math.max(0, data.position);

    // 7. Prevent rollback
    video.watchedDuration = Math.max(video.watchedDuration, safePosition);

    // 8. Clamp
    video.watchedDuration = Math.min(video.watchedDuration, video.duration);

    // 9. Update position
    video.lastPosition = safePosition;
    video.lastWatchedAt = new Date();

    // 10. Completion per video
    if (video.duration > 0 && video.watchedDuration / video.duration >= 0.95) {
      video.completed = true;
    }

    // 11. Playlist progress
    const totalDuration = progress.videoProgress.reduce(
      (acc: number, v: VideoProgressItem) => acc + v.duration,
      0,
    );

    const totalWatched = progress.videoProgress.reduce(
      (acc: number, v: VideoProgressItem) => acc + v.watchedDuration,
      0,
    );

    progress.progressPercentage =
      totalDuration > 0 ? Math.floor((totalWatched / totalDuration) * 100) : 0;

    // 12. Status
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

    // 13. Timestamp
    progress.lastAccessedAt = new Date();

    // 14. Save
    await progress.save();

    // 15. Update project stats
    if (resource.projectId) {
      await updateProjectStats(resource.projectId, userId);
    }

    return progress;
  } catch (error) {
    console.error("Error updating playlist progress:", error);
    throw new Error("Failed to update playlist progress");
  }
};
