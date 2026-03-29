import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import Resource, { ResourceType } from "@/lib/db/models/Resource.model";
import { updateProjectStats } from "../project.servise";

// 🔥 Strong typing
type VideoItem = {
  videoId: string;
  duration: number;
};

export const updatePlaylistProgress = async (
  userId: string,
  resourceId: string,
  data: PlaylistProgressInput,
) => {
  try {
    // 1. Validation
    if (!data.videoId) throw new Error("videoId is required");
    if (data.position === undefined) throw new Error("position is required");

    const videoId = data.videoId.trim();

    // 2. Get resource
    const resource = await Resource.findById(resourceId)
      .select("projectId youtubeData")
      .lean()
      .exec();

    if (!resource) throw new Error("Playlist resource not found");

    const videos = (resource.youtubeData?.videos || []) as VideoItem[];

    // 3. Duration lookup (robust)
    const duration =
      videos.find((v) => v.videoId === videoId)?.duration ?? data.duration ?? 0;

    // 4. Get or create progress
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

    // 5. Find video
    let video = progress.videoProgress.find(
      (v: VideoProgressItem) => v.videoId === videoId,
    );

    // 6. Create if not exists
    if (!video) {
      video = {
        videoId,
        duration,
        watchedDuration: 0,
        lastPosition: 0,
        completed: false,
        lastWatchedAt: new Date(),
      };

      progress.videoProgress.push(video as VideoProgressItem);
    }

    const safePosition = Math.max(0, data.position);

    // 7. Clamp like video API
    const prev = video.watchedDuration || 0;
    const newPos = Math.max(prev, safePosition);
    const clamped = duration > 0 ? Math.min(newPos, duration) : newPos;

    video.watchedDuration = clamped;
    video.lastPosition = clamped;
    video.duration = duration;
    video.lastWatchedAt = new Date();

    // 8. Completion
    if (duration > 0 && clamped >= duration * 0.95) {
      video.completed = true;
    }

    // 9. Playlist aggregation (🔥 FIXED)
    const totalDuration = videos.reduce((acc, v) => acc + (v.duration || 0), 0);

    const totalWatched = progress.videoProgress.reduce(
      (acc: number, v: VideoProgressItem) =>
        acc + Math.min(v.watchedDuration || 0, v.duration || 0),
      0,
    );


    progress.watchedDuration = totalWatched;
    progress.lastWatchedPosition = safePosition;

    progress.progressPercentage =
      totalDuration > 0 ? Math.floor((totalWatched / totalDuration) * 100) : 0;

    // 10. Completion %
    const totalVideos = videos.length;
    const completedVideos = progress.videoProgress.filter(
      (v: VideoProgressItem) => v.completed,
    ).length;

    (progress as any).completedPercentage =
      totalVideos > 0 ? Math.floor((completedVideos / totalVideos) * 100) : 0;

    
    if (progress.progressPercentage >= 95) {
      progress.status = ProgressStatus.COMPLETED;

      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    } else if (progress.progressPercentage > 0) {
      progress.status = ProgressStatus.IN_PROGRESS;
    } else {
      progress.status = ProgressStatus.NOT_STARTED;
    }

    // 11. Timestamp
    if (!progress.startedAt && totalWatched > 0) {
      progress.startedAt = new Date();
    }

    progress.lastAccessedAt = new Date();

    // 12. Save
    await progress.save();

    // 13. Update project stats
    if (resource.projectId) {
      await updateProjectStats(resource.projectId, userId);
    }

    return progress;
  } catch (error) {
    console.error("Error updating playlist progress:", error);
    throw new Error("Failed to update playlist progress");
  }
};
