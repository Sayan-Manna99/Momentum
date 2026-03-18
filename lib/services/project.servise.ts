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
  });

  return project;
};

export const getProjectsByUserId = async (userId: string) => {
  const projects = await Project.find({ userId })
    .sort({ createdAt: -1 })
    .exec();

  return projects;
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
    Resource.countDocuments({ projectId, userId }),
    Progress.countDocuments({
      projectId,
      userId,
      status: ProgressStatus.COMPLETED,
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