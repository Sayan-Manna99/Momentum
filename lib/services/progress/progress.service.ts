import Progress, { ProgressStatus } from "../../db/models/Progress.model";
import Resource, { ResourceType } from "../../db/models/Resource.model";
import { updateProjectStats } from "@/lib/services/project.servise";
import { updateVideoProgress } from "@/lib/services/progress/video.progress.service";
import { updatePlaylistProgress } from "@/lib/services/progress/playlist.progress.service";
import { updatePdfProgress } from "@/lib/services/progress/pdf.progress.service";

// ---------------- TYPE GUARDS ----------------

const isVideoInput = (data: unknown): data is VideoProgressInput => {
  return typeof (data as VideoProgressInput)?.position === "number";
};

const isPlaylistInput = (data: unknown): data is PlaylistProgressInput => {
  return (
    typeof (data as PlaylistProgressInput)?.videoId === "string" &&
    typeof (data as PlaylistProgressInput)?.position === "number"
  );
};

const isPdfInput = (data: unknown): data is PdfProgressInput => {
  return typeof (data as PdfProgressInput)?.currentPage === "number";
};
// ---------------- GET ----------------

export const getProgressByResource = async (
  userId: string,
  resourceId: string,
) => {
  return await Progress.findOne({
    userId,
    resourceId,
  }).exec();
};

// ---------------- UPDATE ----------------

export const updateProgress = async (
  userId: string,
  resourceId: string,
  data: unknown,
) => {
  const resource = await Resource.findById(resourceId).select("type").exec();

  if (!resource) {
    throw new Error("Resource not found");
  }

  switch (resource.type) {
    case ResourceType.YOUTUBE_VIDEO:
      if (!isVideoInput(data)) {
        throw new Error("Invalid video progress input");
      }
      return updateVideoProgress(userId, resourceId, data.position);

    case ResourceType.YOUTUBE_PLAYLIST:
      if (!isPlaylistInput(data)) {
        throw new Error("Invalid playlist progress input");
      }
      return updatePlaylistProgress(userId, resourceId, data);

    case ResourceType.PDF:
      if (!isPdfInput(data)) {
        throw new Error("Invalid PDF progress input");
      }
      return updatePdfProgress(userId, resourceId, data);

    default:
      throw new Error("Unsupported resource type");
  }
};

// ---------------- RESET ----------------

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
        lastAccessedAt: new Date(),
      },
    },
    { new: true },
  ).exec();

  if (!progress) {
    throw new Error("Progress not found");
  }

  const resource = await Resource.findById(resourceId)
    .select("projectId")
    .exec();

  if (resource?.projectId) {
    await updateProjectStats(resource.projectId, userId);
  }

  return progress;
};
