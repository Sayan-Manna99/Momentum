import Project from "../db/models/Project.model";
import { CreateProjectData } from "../validators/project.validator";

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
