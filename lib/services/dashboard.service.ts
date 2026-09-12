import { connectToDB } from "@/lib/db/mongoose";
import Project, { ProjectStatus } from "@/lib/db/models/Project.model";
import Progress, { ProgressStatus } from "@/lib/db/models/Progress.model";
import Resource, { ResourceType } from "@/lib/db/models/Resource.model";

export interface DashboardStats {
  activeProjects: number;
  videosWatched: number;
  pdfsCompleted: number;
}

export interface ProjectCompletionStats {
  completionPercentage: number;
  completedResources: number;
  totalResources: number;
  completedProjects: number;
  totalProjects: number;
  projectsCompletionPercentage: number;
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

export const getProjectCompletionStats = async (
  userId: string,
): Promise<ProjectCompletionStats> => {
  await connectToDB();

  // Find all projects belonging to this user
  const userProjects = await Project.find({ userId }, { _id: 1, status: 1 }).lean();
  const totalProjects = userProjects.length;

  const completedProjects = userProjects.filter(
    (p) => p.status === ProjectStatus.COMPLETED,
  ).length;

  const projectsCompletionPercentage =
    totalProjects > 0
      ? Math.min(100, Math.max(0, Math.round((completedProjects / totalProjects) * 100)))
      : 0;

  if (totalProjects === 0) {
    return {
      completionPercentage: 0,
      completedResources: 0,
      totalResources: 0,
      completedProjects: 0,
      totalProjects: 0,
      projectsCompletionPercentage: 0,
    };
  }

  const projectIds = userProjects.map((p) => p._id);

  // Count total resources across all user's projects
  const totalResources = await Resource.countDocuments({
    projectId: { $in: projectIds },
  });

  if (totalResources === 0) {
    return {
      completionPercentage: 0,
      completedResources: 0,
      totalResources: 0,
      completedProjects,
      totalProjects,
      projectsCompletionPercentage,
    };
  }

  // Count completed resources across user's projects
  const completedResources = await Progress.countDocuments({
    userId,
    projectId: { $in: projectIds },
    $or: [
      { status: ProgressStatus.COMPLETED },
      { progressPercentage: { $gte: 95 } },
    ],
  });

  const completionPercentage = Math.min(
    100,
    Math.max(0, Math.round((completedResources / totalResources) * 100)),
  );

  return {
    completionPercentage,
    completedResources,
    totalResources,
    completedProjects,
    totalProjects,
    projectsCompletionPercentage,
  };
};
