//create resource
import { extractYoutubeData } from "@/lib/utils/youTube";
import Resource from "../db/models/Resource.model";
import { UpdateResourceData } from "@/lib/validators/resource.validation";
//create resource function
export const createResource = async (
  userId: string,
  projectId: string,
  data: any,
) => {
  let youtubeData = null;
  if (data.url) {
    youtubeData = extractYoutubeData(data.url);
  }
  if (!youtubeData) {
    throw new Error("Invalid YouTube URL");
  }
  const resource = await Resource.create({
    userId,
    projectId,
    title: data.title,
    type: data.type,
    youtubeData,
    tags: data.tags || [],
  });

  return resource;
};

//get resources by project id
export const getResourcesByProjectId = async (
  userId: string,
  projectId: string,
) => {
  const resources = await Resource.find({ userId, projectId });
  return resources;
};

//get single resource by id
export const getResourceById = async (userId: string, resourceId: string) => {
  const resource = await Resource.findOne({
    userId,
    _id: resourceId,
  }).exec();

  return resource;
};

//update resource by id
export const updateResourceById = async (
  userId: string,
  resourceId: string,
  updateData: UpdateResourceData,
) => {
  const resource = await Resource.findOneAndUpdate(
    { userId, _id: resourceId },
    { $set: updateData },
    { new: true },
  ).exec();

  return resource;
};

//delete resource by id
export const deleteResourceById = async (
  userId: string,
  resourceId: string,
) => {
  const resource = await Resource.findOneAndDelete({
    userId,
    _id: resourceId,
  }).exec();

  return resource;
};