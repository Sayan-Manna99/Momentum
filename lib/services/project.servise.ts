import Project from "../db/models/Project.model";
import {
  CreateProjectData,
  UpdateProjectData,
} from "../validators/project.validator";
import Resource from "../db/models/Resource.model";
import Progress from "../db/models/Progress.model";
import { ProgressStatus } from "../db/models/Progress.model";
import { InferSchemaType } from "mongoose";

type ProjectType = InferSchemaType<typeof Project.schema>;

export const createProject = async (
  data: CreateProjectData,
  userId: string,
): Promise<ProjectType> => {
  const project = await Project.create({
    ...data,
    userId,
    targetEndDate: data.targetEndDate
      ? new Date(data.targetEndDate)
      : undefined,
  });

  return project;
};

export const getProjectsByUserId = async (userId: string) => {
  const projects = await Project.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      const resources = await Resource.find(
        { projectId: project._id },
        { _id: 1, type: 1 },
      );

      const progressList = await Progress.find(
        {
          userId,
          resourceId: { $in: resources.map((r) => r._id) },
        },
        { status: 1 },
      );

      const totalResources = resources.length;
      const completedResources = progressList.filter(
        (p) => p.status === ProgressStatus.COMPLETED,
      ).length;

      const progressPercentage =
        totalResources > 0
          ? Math.round((completedResources / totalResources) * 100)
          : 0;

      const resourceStats = {
        video: 0,
        playlist: 0,
        pdf: 0,
      };

      for (const r of resources) {
        if (r.type === "youtube_video") resourceStats.video++;
        else if (r.type === "youtube_playlist") resourceStats.playlist++;
        else if (r.type === "pdf") resourceStats.pdf++;
      }

      let isOverdue = false;

      if (project.targetEndDate) {
        const targetDate = new Date(project.targetEndDate);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        isOverdue =
          !isNaN(targetDate.getTime()) &&
          today > targetDate &&
          project.status !== "completed";
      }

      return {
        _id: project._id.toString(), // Convert ObjectId to string
        userId: project.userId,
        title: project.title,
        description: project.description,
        tags: project.tags,
        color: project.color,
        status: project.status,
        order: project.order,
        isPinned: project.isPinned,
        isFavorite: project.isFavorite,
        goals: project.goals,
        targetEndDate: project.targetEndDate
          ? new Date(project.targetEndDate).toISOString()
          : null,
        createdAt: new Date(project.createdAt).toISOString(),
        updatedAt: new Date(project.updatedAt).toISOString(),

        // Computed fields
        stats: {
          totalResources,
          completedResources,
          progressPercentage,
        },

        resourceStats: resourceStats,
        isOverdue: isOverdue,
      };
    }),
  );

  return enrichedProjects;
};

export const getOneProject = async (userId: string, projectId: string) => {
  const project = await Project.findOne({
    userId,
    _id: projectId,
  }).exec();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};
export const updateOneProject = async (
  userId: string,
  projectId: string,
  data: UpdateProjectData,
) => {
  const project = await Project.findOneAndUpdate(
    { userId, _id: projectId },
    { $set: data },
    { new: true, runValidators: true },
  ).exec();
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};

export const deleteOneProject = async (userId: string, projectId: string) => {
  const result = await Project.deleteOne({ userId, _id: projectId }).exec();
  return result;
};
export const updateProjectStats = async (projectId: string, userId: string) => {
  const [totalResources, completedResources] = await Promise.all([
    Resource.countDocuments({ projectId }), // ✅ FIXED
    Progress.countDocuments({
      projectId,
      userId,
      status: ProgressStatus.COMPLETED, // ✅ keep consistent
    }),
  ]);

  const progressPercentage =
    totalResources === 0
      ? 0
      : Math.floor((completedResources / totalResources) * 100);

  return await Project.findByIdAndUpdate(
    projectId,
    {
      stats: {
        totalResources,
        completedResources,
        progressPercentage,
      },
    },
    { new: true },
  );
};