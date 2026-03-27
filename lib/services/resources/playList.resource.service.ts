import Resource, { ResourceType } from "@/lib/db/models/Resource.model";
import { extractYoutubeData, getMultipleVideoDurations, getPlaylistVideos } from "@/lib/utils/youTube";
import { updateProjectStats } from "../project.servise";

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

  if (!videoIds || videoIds.length === 0) {
    throw new Error("No videos found in playlist");
  }

  // 🔥 Fetch durations (NOW RETURNS MAP)
  const durationMap = await getMultipleVideoDurations(videoIds);

  // 🔥 Build videos array (CORRECT WAY)
  const videos = videoIds.map((id) => ({
    videoId: id,
    duration: durationMap[id] ?? 0,
  }));

  // 🔥 Correct total duration
  const totalDuration = videos.reduce((sum, v) => sum + (v.duration || 0), 0);

  console.log("MAPPED VIDEOS:", videos);

  const payload = {
    userId,
    projectId,
    title: data.title,
    type: ResourceType.YOUTUBE_PLAYLIST,
    youtubeData: {
      playlistId: youtubeData.playlistId,
      videos,
    },
    videoCount: videoIds.length,
    totalDuration,
    tags: data.tags ?? [],
  };

  console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

  const resource = await Resource.create(payload);

  await updateProjectStats(projectId, userId);

  return resource;
};
