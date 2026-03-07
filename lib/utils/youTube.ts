export function extractYoutubeData(url: string) {
  const parsed = new URL(url);

  const videoId = parsed.searchParams.get("v");
  const playlistId = parsed.searchParams.get("list");

  return {
    videoId,
    playlistId,
  };
}
