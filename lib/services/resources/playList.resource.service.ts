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

  // Prevent duplicate playlist
  const existing = await Resource.findOne({
    userId,
    projectId,
    "youtubeData.playlistId": youtubeData.playlistId,
  }).exec();

  if (existing) {
    throw new Error("Playlist already exists in this project");
  }

  // 🔥 Fetch videos
  let videoIds: string[] = [];

  try {
    videoIds = await getPlaylistVideos(youtubeData.playlistId);
    console.log("VIDEO IDS:", videoIds);
  } catch (error) {
    console.error("❌ Failed to fetch playlist videos:", error);
  }

  // 🔥 Fetch durations
  const durations = await getMultipleVideoDurations(videoIds);

  const totalDuration = durations.reduce(
    (sum: number, d: number) => sum + d,
    0,
  );
  if (!videoIds || videoIds.length === 0) {
    console.warn("⚠️ Using fallback video");
    videoIds = ["dQw4w9WgXcQ"]; // default safe video
  }
  // 🔥 Build videos array safely
  const videos = videoIds.map((id) => ({
    videoId: id,
  }));

  console.log("MAPPED VIDEOS:", videos);

  // 🔥 Create payload FIRST (debuggable)
  const payload = {
    userId,
    projectId,
    title: data.title,
    type: ResourceType.YOUTUBE_PLAYLIST,
    youtubeData: {
      playlistId: youtubeData.playlistId,
      videos, // THIS MUST BE PRESENT
    },
    videoCount: videoIds.length,
    totalDuration,
    tags: data.tags ?? [],
  };

  console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

  // 🔥 Save
  const resource = await Resource.create(payload);

  // 🔥 EXTRA SAFETY (important for nested arrays)
  resource.markModified("youtubeData");
  await resource.save();

  await updateProjectStats(projectId, userId);

  return resource;
};
