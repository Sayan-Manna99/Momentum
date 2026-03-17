import Resource from "@/lib/db/models/Resource.model";
import { extractYoutubeData } from "@/lib/utils/youTube";



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

  const resource = await Resource.create({
    userId,
    projectId,
    title: data.title,
    type: "youtube_playlist",
    youtubeData: {
      playlistId: youtubeData.playlistId,
    },
    videoCount: data.videoCount ?? 0,
    tags: data.tags ?? [],
  });

  return resource;
};
