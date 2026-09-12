import { connectToDB } from "@/lib/db/mongoose";
import Project, { ProjectStatus } from "@/lib/db/models/Project.model";
import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import { ResourceType } from "@/lib/db/models/Resource.model";

export interface DashboardStats {
  activeProjects: number;
  videosWatched: number;
  pdfsCompleted: number;
}

export const getDashboardStats = async (
  userId: string,
): Promise<DashboardStats> => {
  await connectToDB();

  const [activeProjects, videosWatched, pdfsCompleted] = await Promise.all([
    // 1. Active Projects for currently authenticated user
    // Active projects are those belonging to user where status is not COMPLETED or ARCHIVED
    Project.countDocuments({
      userId,
      status: { $nin: [ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED] },
    }),

    // 2. Videos Watched by currently authenticated user
    // Counts video resources completed by user (progress status is COMPLETED or percentage >= 95)
    Progress.countDocuments({
      userId,
      resourceType: ResourceType.YOUTUBE_VIDEO,
      $or: [
        { status: ProgressStatus.COMPLETED },
        { progressPercentage: { $gte: 95 } },
      ],
    }),

    // 3. PDFs Completed by currently authenticated user
    // Counts PDF resources completed by user (progress status is COMPLETED or percentage >= 100)
    Progress.countDocuments({
      userId,
      resourceType: ResourceType.PDF,
      $or: [
        { status: ProgressStatus.COMPLETED },
        { progressPercentage: { $gte: 100 } },
      ],
    }),
  ]);

  return {
    activeProjects,
    videosWatched,
    pdfsCompleted,
  };
};
