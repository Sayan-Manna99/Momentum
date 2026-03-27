"use client";

import { useState } from "react";
import { YoutubePlayer } from "./YouTubePlayer";

export const PlaylistView = ({ resource }: { resource: Resource }) => {
   
  const videos = (resource.youtubeData as YoutubePlaylistData)?.videos || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!videos.length) {
    return <div className="text-white">No videos found</div>;
  }
   if (resource.type !== "youtube_playlist") {
     return <div>Invalid playlist</div>;
   }
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* LEFT: VIDEO LIST */}
      <div className="col-span-1 space-y-2 max-h-[80vh] overflow-y-auto">
        {videos.map((video: any, index: number) => (
          <div
            key={video.videoId}
            onClick={() => setCurrentIndex(index)}
            className={`p-2 rounded cursor-pointer ${
              index === currentIndex
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Video {index + 1}
          </div>
        ))}
      </div>

      {/* RIGHT: PLAYER */}
      <div className="col-span-2">
        <YoutubePlayer
          videoId={videos[currentIndex].videoId}
          resourceId={resource._id}
          playlistMode={true}
          onEnd={() => {
            if (videos[currentIndex + 1]) {
              setCurrentIndex(currentIndex + 1);
            }
          }}
        />
      </div>
    </div>
  );
};
