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

export interface ActiveProjectItem {
  id: string;
  title: string;
  totalResources: number;
  completedResources: number;
  progressPercentage: number;
  updatedAt: string;
}

export interface RecentActivityItem {
  id: string;
  type:
    | "completed_video"
    | "completed_pdf"
    | "started_reading"
    | "started_video"
    | "project_created";
  action: string;
  title: string;
  timestamp: string;
  icon?: string;
}

export interface UpcomingDeadlineItem {
  id: string;
  projectName: string;
  deadline: string; // ISO string
  daysRemaining: number;
  urgency: "critical" | "high" | "medium" | "low";
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
  const userProjects = await Project.find(
    { userId },
    { _id: 1, status: 1 },
  ).lean();
  const totalProjects = userProjects.length;

  const completedProjects = userProjects.filter(
    (p) => p.status === ProjectStatus.COMPLETED,
  ).length;

  const projectsCompletionPercentage =
    totalProjects > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((completedProjects / totalProjects) * 100)),
        )
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

  const projectIds = resources.map((r) => r.projectId).filter(Boolean);

  const projects =
    projectIds.length > 0
      ? await Project.find(
          { _id: { $in: projectIds } },
          { _id: 1, title: 1 },
        ).lean()
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
      const watched =
        progress.lastWatchedPosition || progress.watchedDuration || 0;
      const total =
        resource.totalDuration || resource.youtubeData?.duration || 0;
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
      const completedCount = videoProgressArr.filter(
        (v: any) => v.completed,
      ).length;
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

export const getTopActiveProjects = async (
  userId: string,
  limit = 3,
): Promise<ActiveProjectItem[]> => {
  await connectToDB();

  // Find active projects for user sorted by updatedAt DESC
  const projects = await Project.find({
    userId,
    status: { $nin: [ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED] },
  })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  if (projects.length === 0) {
    return [];
  }

  const enriched = await Promise.all(
    projects.map(async (project) => {
      const resources = await Resource.find(
        { projectId: project._id },
        { _id: 1 },
      ).lean();

      const totalResources = resources.length;
      let completedResources = 0;

      if (totalResources > 0) {
        completedResources = await Progress.countDocuments({
          userId,
          projectId: project._id,
          $or: [
            { status: ProgressStatus.COMPLETED },
            { progressPercentage: { $gte: 95 } },
          ],
        });
      }

      const progressPercentage =
        totalResources > 0
          ? Math.min(
              100,
              Math.max(
                0,
                Math.round((completedResources / totalResources) * 100),
              ),
            )
          : 0;

      return {
        id: project._id.toString(),
        title: project.title,
        totalResources,
        completedResources,
        progressPercentage,
        updatedAt: new Date(
          project.updatedAt || project.createdAt,
        ).toISOString(),
      };
    }),
  );

  return enriched;
};

export const getRecentActivities = async (
  userId: string,
  limit = 4,
): Promise<RecentActivityItem[]> => {
  await connectToDB();

  const activities: RecentActivityItem[] = [];

  // 1. Fetch recently completed videos/PDFs (with completedAt timestamp)
  const completedProgress = await Progress.find({
    userId,
    completedAt: { $exists: true, $ne: null },
  })
    .sort({ completedAt: -1 })
    .limit(20) // Fetch more to filter later
    .lean();

  // 2. Fetch recently started resources (with startedAt timestamp, not yet completed)
  const startedProgress = await Progress.find({
    userId,
    startedAt: { $exists: true, $ne: null },
    completedAt: { $exists: false },
  })
    .sort({ startedAt: -1 })
    .limit(20)
    .lean();

  // 3. Fetch recently created projects
  const recentProjects = await Project.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Get resource IDs and project IDs to fetch details
  const resourceIds = [
    ...completedProgress.map((p) => p.resourceId),
    ...startedProgress.map((p) => p.resourceId),
  ];

  const projectIds = [...new Set(recentProjects.map((p) => p._id))];

  const resources =
    resourceIds.length > 0
      ? await Resource.find({ _id: { $in: resourceIds } }).lean()
      : [];

  const projectsMap = new Map(
    recentProjects.map((p) => [
      p._id.toString(),
      {
        title: p.title,
        createdAt: new Date(p.createdAt || Date.now()),
      },
    ]),
  );

  const resourceMap = new Map(
    resources.map((r) => [
      r._id.toString(),
      {
        title: r.title,
        type: r.type,
      },
    ]),
  );

  // Process completed activities
  for (const progress of completedProgress) {
    const resourceIdStr = progress.resourceId.toString();
    const resource = resourceMap.get(resourceIdStr);

    if (!resource) continue;

    const timestamp = new Date(progress.completedAt || Date.now());
    let type: RecentActivityItem["type"];
    let action: string;

    if (resource.type === ResourceType.YOUTUBE_VIDEO) {
      type = "completed_video";
      action = "Completed video";
    } else if (resource.type === ResourceType.PDF) {
      type = "completed_pdf";
      action = "Completed reading";
    } else if (resource.type === ResourceType.YOUTUBE_PLAYLIST) {
      type = "completed_video";
      action = "Completed playlist";
    } else {
      type = "completed_video";
      action = "Completed resource";
    }

    activities.push({
      id: resourceIdStr,
      type,
      action,
      title: resource.title || "Untitled Resource",
      timestamp: timestamp.toISOString(),
    });
  }

  // Process started activities
  for (const progress of startedProgress) {
    const resourceIdStr = progress.resourceId.toString();
    const resource = resourceMap.get(resourceIdStr);

    if (!resource) continue;

    const timestamp = new Date(progress.startedAt || Date.now());
    let type: RecentActivityItem["type"];
    let action: string;

    if (resource.type === ResourceType.YOUTUBE_VIDEO) {
      type = "started_video";
      action = "Started video";
    } else if (resource.type === ResourceType.PDF) {
      type = "started_reading";
      action = "Started reading";
    } else if (resource.type === ResourceType.YOUTUBE_PLAYLIST) {
      type = "started_video";
      action = "Started playlist";
    } else {
      type = "started_reading";
      action = "Started resource";
    }

    activities.push({
      id: resourceIdStr,
      type,
      action,
      title: resource.title || "Untitled Resource",
      timestamp: timestamp.toISOString(),
    });
  }

  // Process project creation activities
  for (const project of recentProjects) {
    const projectIdStr = project._id.toString();
    const timestamp = new Date(project.createdAt || Date.now());

    activities.push({
      id: projectIdStr,
      type: "project_created",
      action: "New project created",
      title: project.title || "Untitled Project",
      timestamp: timestamp.toISOString(),
    });
  }

  // Sort by timestamp descending and return only the latest 'limit' items
  activities.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA;
  });

  return activities.slice(0, limit);
};

export const getUpcomingDeadlines = async (
  userId: string,
  limit = 4,
): Promise<UpcomingDeadlineItem[]> => {
  await connectToDB();

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  // Find all projects with targetEndDate in the future, belonging to the user
  const projects = await Project.find({
    userId,
    targetEndDate: { $gte: now },
    status: { $ne: ProjectStatus.COMPLETED }, // Don't show completed projects
  })
    .sort({ targetEndDate: 1 }) // Sort by deadline ascending (nearest first)
    .limit(limit)
    .lean();

  // Calculate deadlines
  const deadlines: UpcomingDeadlineItem[] = projects.map((project) => {
    const deadline = new Date(project.targetEndDate);
    const differenceInMs = deadline.getTime() - now.getTime();
    const daysRemaining = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    // Determine urgency based on days remaining
    let urgency: "critical" | "high" | "medium" | "low";
    if (daysRemaining <= 2) {
      urgency = "critical";
    } else if (daysRemaining <= 7) {
      urgency = "high";
    } else if (daysRemaining <= 14) {
      urgency = "medium";
    } else {
      urgency = "low";
    }

    return {
      id: project._id.toString(),
      projectName: project.title,
      deadline: deadline.toISOString(),
      daysRemaining: Math.max(0, daysRemaining),
      urgency,
    };
  });

  return deadlines;
};
