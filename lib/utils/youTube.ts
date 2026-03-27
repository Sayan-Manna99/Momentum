import axios from "axios";

export function extractYoutubeData(url: string) {
  const parsed = new URL(url);

  let videoId: string | null = null;
  let playlistId: string | null = null;

  // Standard: youtube.com/watch?v=ID
  videoId = parsed.searchParams.get("v");

  // Short: youtu.be/ID
  if (!videoId && parsed.hostname === "youtu.be") {
    videoId = parsed.pathname.slice(1); // remove leading /
  }

  // Shorts: youtube.com/shorts/ID
  if (!videoId && parsed.pathname.startsWith("/shorts/")) {
    videoId = parsed.pathname.split("/shorts/")[1].split("/")[0];
  }

  // Embed: youtube.com/embed/ID
  if (!videoId && parsed.pathname.startsWith("/embed/")) {
    videoId = parsed.pathname.split("/embed/")[1].split("/")[0];
  }

  playlistId = parsed.searchParams.get("list");

  return { videoId, playlistId };
}

const API_KEY = process.env.YOUTUBE_API_KEY!;
console.log("YT KEY:", process.env.YOUTUBE_API_KEY);
export const getVideoDetails = async (videoId: string) => {
  const res = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
    params: {
      part: "contentDetails",
      id: videoId,
      key: API_KEY,
    },
  });

  const durationISO = res.data.items[0]?.contentDetails?.duration;

  if (!durationISO) {
    throw new Error("Failed to fetch video duration");
  }

  return {
    duration: convertISOToSeconds(durationISO),
  };
};
// Convert ISO 8601 (PT5M30S) → seconds
const convertISOToSeconds = (iso: string): number => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
};

export const getPlaylistVideos = async (
  playlistId: string,
): Promise<string[]> => {
  const videoIds: string[] = [];

  let nextPageToken: string | undefined = undefined;

  do {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "contentDetails",
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: API_KEY,
        },
      },
    );

    const items = res.data.items || [];

    for (const item of items) {
      if (item.contentDetails?.videoId) {
        videoIds.push(item.contentDetails.videoId);
      }
    }

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return videoIds;
};
export const getMultipleVideoDurations = async (
  videoIds: string[],
): Promise<Record<string, number>> => {
  if (videoIds.length === 0) return {};

  const durationMap: Record<string, number> = {};

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);

    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "contentDetails",
          id: chunk.join(","),
          key: API_KEY,
        },
      },
    );

    const items = res.data.items || [];

    for (const item of items) {
      const id = item.id;
      const iso = item.contentDetails?.duration;

      if (id && iso) {
        durationMap[id] = convertISOToSeconds(iso);
      }
    }
  }

  return durationMap;
};

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const hours = Math.floor(minutes / 60);
  const seconds = duration % 60;
  return `${hours}h ${minutes % 60}m ${seconds}s`;
};