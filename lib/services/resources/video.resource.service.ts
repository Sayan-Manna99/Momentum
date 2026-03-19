import Resource from "@/lib/db/models/Resource.model";
import { extractYoutubeData, getVideoDetails } from "@/lib/utils/youTube";
import { updateProjectStats } from "../project.servise";

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
  // ✅ Better naming
  const videoDetails = await getVideoDetails(youtubeData.videoId!);

  const resource = await Resource.create({
    userId,
    projectId,
    title: data.title,
    type: data.type,
    youtubeData,
    totalDuration: videoDetails.duration,
    tags: data.tags || [],
  });
  await updateProjectStats(projectId, userId);
  return resource;
};;