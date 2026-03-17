import Progress from "../../db/models/Progress.model";
import Resource, { ResourceType } from "../../db/models/Resource.model";
import { ProgressStatus } from "../../db/models/Progress.model";
import { updateProjectStats } from '@/lib/services/project.servise'
import { updateVideoProgress } from '@/lib/services/progress/video.progress.service';
import { updatePlaylistProgress } from '@/lib/services/progress/playlist.progress.service'
import { updatePdfProgress } from '@/lib/services/progress/pdf.progress.service'

// Get progress of a resource for a user
export const getProgressByResource = async (
  userId: string,
  resourceId: string,
) => {
  const progress = await Progress.findOne({
    userId,
    resourceId,
  }).exec();

  return progress;
};

// Update progress of a resource for a user

export const updateProgress = async (
  userId: string,
  resourceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const resource = await Resource.findById(resourceId).select("type").exec();

  if (!resource) {
    throw new Error("Resource not found");
  }



 switch (resource.type) {
   case ResourceType.YOUTUBE_VIDEO:
     return updateVideoProgress(userId, resourceId, data.position);

   case ResourceType.YOUTUBE_PLAYLIST:
     return updatePlaylistProgress(userId, resourceId, data.videoId);

   case ResourceType.PDF:
     return updatePdfProgress(userId, resourceId, {
       pagesRead: data.pagesRead,
       lastPageRead: data.lastPageRead,
     });

   default:
     throw new Error("Unsupported resource type");
 }
};




// Reset progress of a resource for a user
export const resetProgress = async (
  userId: string,
  resourceId: string
) => {

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
    { new: true }
  ).exec();


  if (!progress) {
    throw new Error("Progress not found");
  }


  // Update project stats after reset
  const resource = await Resource
    .findById(resourceId)
    .select("projectId")
    .exec();

  if (resource?.projectId) {
    await updateProjectStats(resource.projectId, userId);
  }

  return progress;
};