import Resource from "@/lib/db/models/Resource.model";
import { extractYoutubeData } from "@/lib/utils/youTube";
import { updateProjectStats } from "../project.servise";
import {
  getPlaylistVideos,
  getMultipleVideoDurations,
} from "@/lib/utils/youTube";
import { ResourceType } from "@/lib/db/models/Resource.model";

export const createPlaylistResource = async (
  userId: string,
  projectId: string,
  data: CreatePlaylistResourceData,
) => {
  const youtubeData = extractYoutubeData(data.url);

  if (!youtubeData || !youtubeData.playlistId) {
    throw new Error("Invalid YouTube playlist URL");
  }

  // Prevent duplicate playlist in the same project
  const existing = await Resource.findOne({
    userId,
    projectId,
    "youtubeData.playlistId": youtubeData.playlistId,
  }).exec();

  if (existing) {
    throw new Error("Playlist already exists in this project");
  }

  //  NEW: Fetch videos + durations
  const videoIds = await getPlaylistVideos(youtubeData.playlistId);

  const durations = await getMultipleVideoDurations(videoIds);

  const totalDuration = durations.reduce((sum:number, d:number) => sum + d, 0);

  const resource = await Resource.create({
    userId,
    projectId,
    title: data.title,
    type: ResourceType.YOUTUBE_PLAYLIST, // ✅ better than string
    youtubeData: {
      playlistId: youtubeData.playlistId,
    },
    videoCount: videoIds.length, // ✅ real count
    totalDuration, // ✅ MAIN ADDITION
    tags: data.tags ?? [],
  });

  await updateProjectStats(projectId, userId);

  return resource;
};
