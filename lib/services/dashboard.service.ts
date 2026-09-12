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

export interface ContinueLearningItem {
  id: string;
  title: string;
  type: ResourceType;
  projectName?: string;
  progressPercentage: number;
  subtitle: string;
  lastAccessedAt: string;
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

export const getContinueLearningResources = async (
  userId: string,
  limit = 3,
): Promise<ContinueLearningItem[]> => {
  await connectToDB();

  // 1. Get user's active/in-progress records sorted by lastAccessedAt DESC (excluding completed resources)
  const recentProgressList = await Progress.find({
    userId,
    status: { $ne: ProgressStatus.COMPLETED },
    progressPercentage: { $lt: 95 },
  })
    .sort({ lastAccessedAt: -1, updatedAt: -1 })
    .limit(limit)
    .lean();

  if (recentProgressList.length === 0) {
    return [];
  }

  // 2. Fetch linked resources and projects
  const resourceIds = recentProgressList.map((p) => p.resourceId);
  const resources = await Resource.find({ _id: { $in: resourceIds } }).lean();

  const projectIds = resources
    .map((r) => r.projectId)
    .filter(Boolean);

  const projects = projectIds.length > 0
    ? await Project.find({ _id: { $in: projectIds } }, { _id: 1, title: 1 }).lean()
    : [];

  const projectMap = new Map(projects.map((p) => [p._id.toString(), p.title]));
  const resourceMap = new Map(resources.map((r) => [r._id.toString(), r]));

  const formatDurationStr = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "0m";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  // 3. Build formatted list preserving progress sorting order
  const result: ContinueLearningItem[] = [];

  for (const progress of recentProgressList) {
    const resourceIdStr = progress.resourceId.toString();
    const resource = resourceMap.get(resourceIdStr);

    if (!resource) continue;

    const projectName = resource.projectId
      ? projectMap.get(resource.projectId.toString()) || ""
      : "";

    const progressPercentage = Math.min(
      100,
      Math.max(0, Math.round(progress.progressPercentage || 0)),
    );

    let subtitle = "";

    if (resource.type === ResourceType.YOUTUBE_VIDEO) {
      const watched = progress.lastWatchedPosition || progress.watchedDuration || 0;
      const total = resource.totalDuration || resource.youtubeData?.duration || 0;
      subtitle =
        total > 0
          ? `Video • ${formatDurationStr(watched)} of ${formatDurationStr(total)} watched`
          : `Video • ${progressPercentage}% completed`;
    } else if (resource.type === ResourceType.PDF) {
      const pagesRead = progress.pagesRead || progress.lastPageRead || 0;
      const totalPages = resource.pdfData?.pageCount || 1;
      subtitle = `PDF • ${pagesRead} of ${totalPages} pages read`;
    } else if (resource.type === ResourceType.YOUTUBE_PLAYLIST) {
      const videoProgressArr = (progress as any).videoProgress || [];
      const completedCount = videoProgressArr.filter((v: any) => v.completed).length;
      const totalCount =
        resource.videoCount ||
        resource.youtubeData?.videos?.length ||
        videoProgressArr.length ||
        0;
      subtitle =
        totalCount > 0
          ? `Playlist • ${completedCount} of ${totalCount} videos completed`
          : `Playlist • ${progressPercentage}% completed`;
    } else {
      subtitle = `${progressPercentage}% complete`;
    }

    result.push({
      id: resourceIdStr,
      title: resource.title || "Untitled Resource",
      type: resource.type as ResourceType,
      projectName,
      progressPercentage,
      subtitle,
      lastAccessedAt: new Date(
        progress.lastAccessedAt || (progress as any).updatedAt || Date.now(),
      ).toISOString(),
    });
  }

  return result;
};
