import Progress from "@/lib/db/models/Progress.model";
import Resource from "@/lib/db/models/Resource.model";
import mongoose from "mongoose";

// {
//   totalResources,
//   completedResources,
//   progressPercentage,
//   totalVideos,
//   totalPDFs,
//   totalPlaylists
// }

export const getTotalResourceCount = async (projectId: string) => {
  try {
    const result = await Resource.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    let totalVideos = 0;
    let totalPDFs = 0;
    let totalPlaylists = 0;

    result.forEach((item) => {
      if (item._id === "youtube_video") totalVideos = item.count;
      if (item._id === "pdf") totalPDFs = item.count;
      if (item._id === "youtube_playlist") totalPlaylists = item.count;
    });

    const totalResources = totalVideos + totalPDFs + totalPlaylists;

    return {
      totalResources,
      totalVideos,
      totalPDFs,
      totalPlaylists,
    };
  } catch (error) {
    console.error("Error in getTotalResourceCount:", error);
    throw error;
  }
};

export const getProgressStats = async (projectId: string, userId: string) => {
  try {
    const objectProjectId = new mongoose.Types.ObjectId(projectId);

    // 1. Total resources
    const totalResources = await Resource.countDocuments({
      projectId: objectProjectId,
    });

    // 2. Aggregate progress states
    const progressStats = await Progress.aggregate([
      {
        $match: {
          projectId: objectProjectId,
          userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let completed = 0;
    let inProgress = 0;

    progressStats.forEach((item) => {
      if (item._id === "completed") completed = item.count;
      if (item._id === "in_progress") inProgress = item.count;
    });

    const tracked = completed + inProgress;
    const notStarted = totalResources - tracked;

    return {
      completed,
      inProgress,
      notStarted,
    };
  } catch (error) {
    console.error("Error in getProgressStats:", error);
    throw error;
  }
};