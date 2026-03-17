import Resource from "@/lib/db/models/Resource.model";
import { extractYoutubeData } from "@/lib/utils/youTube";

export const createVideoResource = async (
  userId: string,
  projectId: string,

  data: any,
) => {
  let youtubeData = null;
  if (data.url) {
    //modify extractYoutubeData later
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