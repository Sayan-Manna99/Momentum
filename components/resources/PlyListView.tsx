"use client";

import { useState } from "react";
import { YoutubePlayer } from "./YouTubePlayer";
import { formatDuration } from "@/lib/utils/youTube";

export const PlaylistView = ({ resource }: { resource: Resource }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Type-safe extraction
  let videos: { videoId: string; duration?: number }[] = [];

  if (
    resource.type === "youtube_playlist" &&
    resource.youtubeData &&
    "videos" in resource.youtubeData
  ) {
    videos = resource.youtubeData.videos;
  }

  if (resource.type !== "youtube_playlist") {
    return <div className="text-white">Invalid playlist</div>;
  }

  if (!videos.length) {
    return <div className="text-white">No videos found</div>;
  }
return (
  <div className="flex gap-4 h-[80vh] w-full">
    {/* LEFT: VIDEO LIST (fixed width) */}
    <div className="w-[350px] shrink-0 overflow-y-auto pr-2 space-y-2 border-r border-gray-800">
      {videos.map((video, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={video.videoId}
            onClick={() => setCurrentIndex(index)}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${
              isActive
                ? "bg-blue-600 border-blue-400"
                : "bg-gray-900 hover:bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Video {index + 1}</span>

              <span className="text-xs text-gray-400">
                {formatDuration(video.duration ?? 0)}
              </span>
            </div>

            {/* future progress bar */}
            <div className="mt-2 h-1 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-400" style={{ width: "0%" }} />
            </div>
          </div>
        );
      })}
    </div>

    {/* RIGHT: PLAYER (flex-grow) */}
    <div className="flex-1 min-w-0">
      <YoutubePlayer
        videoId={videos[currentIndex].videoId}
        resourceId={resource._id}
        playlistMode={true}
        onEnd={() => {
          if (videos[currentIndex + 1]) {
            setCurrentIndex((prev) => prev + 1);
          }
        }}
      />
    </div>
  </div>
);
};
