import Project from "../db/models/Project.model";
import {
  CreateProjectData,
  UpdateProjectData,
} from "../validators/project.validator";

export const createProject = async (
  data: CreateProjectData,
  userId: string,
) => {
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
    userId: userId,
    _id: projectId,
  }).exec();
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

  return project;
};

export const deleteOneProject = async (userId: string, projectId: string) => {
  const result = await Project.deleteOne({ userId, _id: projectId }).exec();
  return result.deletedCount === 1;
}