import Resource from "@/lib/db/models/Resource.model";
import {
  CreateResourceData,
  VideoResourceData,
  PlaylistResourceData,
  PdfResourceData,
  UpdateResourceData,
} from "@/lib/validators/resource.validation";

import { createVideoResource } from "@/lib/services/resources/video.resource.service";
import { createPlaylistResource } from "@/lib/services/resources/playList.resource.service";
import { createPdfResource } from "@/lib/services/resources/pdf.resource.service";


type ResourceHandlers = {
  youtube_video: (
    userId: string,
    projectId: string,
    data: VideoResourceData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  youtube_playlist: (
    userId: string,
    projectId: string,
    data: PlaylistResourceData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  pdf: (
    userId: string,
    projectId: string,
    data: PdfResourceData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
};

const handlers: ResourceHandlers = {
  youtube_video: createVideoResource,
  youtube_playlist: createPlaylistResource,
  pdf: createPdfResource,
};

export const createResource = async (
  userId: string,
  projectId: string,
  data: CreateResourceData,
) => {
  console.log("🔥 RESOURCE TYPE:", data.type);
  const handler = handlers[data.type];
  console.log("Handler name", handler); // 👈 ADD
  if (!handler) {
    throw new Error("Unsupported resource type");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler(userId, projectId, data as any);
};

export const getResourcesByProjectId = async (
  userId: string,
  projectId: string,
) => {
  return Resource.find({ userId, projectId });
};

export const getResourceById = async (userId: string, resourceId: string) => {
  return Resource.findOne({ userId, _id: resourceId }).exec();
};

export const updateResourceById = async (
  userId: string,
  resourceId: string,
  updateData: UpdateResourceData,
) => {
  return Resource.findOneAndUpdate(
    { userId, _id: resourceId },
    { $set: updateData },
    { new: true },
  ).exec();
};

export const deleteResourceById = async (
  userId: string,
  resourceId: string,
) => {
  return Resource.findOneAndDelete({ userId, _id: resourceId }).exec();
};
