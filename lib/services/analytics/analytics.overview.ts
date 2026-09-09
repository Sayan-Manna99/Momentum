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

    const progressStats = await Resource.aggregate([
      // 1. Get only resources belonging to this project
      {
        $match: {
          projectId: objectProjectId,
        },
      },

      // 2. Find this user's progress for each resource
      {
        $lookup: {
          from: "progresses",
          let: {
            resourceId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$resourceId", "$$resourceId"],
                    },
                    {
                      $eq: ["$userId", userId],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                status: 1,
              },
            },
          ],
          as: "progress",
        },
      },

      // 3. Convert missing progress into NOT_STARTED
      {
        $addFields: {
          status: {
            $ifNull: [
              {
                $arrayElemAt: ["$progress.status", 0],
              },
              "not_started",
            ],
          },
        },
      },

      // 4. Count each status
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    progressStats.forEach((item) => {
      if (item._id === "completed") {
        completed = item.count;
      }

      if (item._id === "in_progress") {
        inProgress = item.count;
      }

      if (item._id === "not_started") {
        notStarted = item.count;
      }
    });

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