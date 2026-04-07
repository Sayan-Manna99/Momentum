"use client";

import { useMemo, useState } from "react";
import { YoutubePlayer } from "./YouTubePlayer";
import { formatDuration } from "@/lib/utils/youTube";
import { ProgressBar } from "../projects/ProgressBar";

export const PlaylistView = ({
  resource,
  progress,
}: {
  resource: Resource;
  progress: any;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // extract videos
  let videos: { videoId: string; duration?: number }[] = [];

  if (
    resource.type === "youtube_playlist" &&
    resource.youtubeData &&
    "videos" in resource.youtubeData
  ) {
    videos = resource.youtubeData.videos;
  }

  // 🔥 build progress map
  const progressMap = useMemo(() => {
    const map: Record<string, any> = {};
    progress?.videoProgress?.forEach((v: any) => {
      map[v.videoId] = v;
    });
    return map;
  }, [progress]);

  if (resource.type !== "youtube_playlist") {
    return <div className="text-white">Invalid playlist</div>;
  }

  if (!videos.length) {
    return <div className="text-white">No videos found</div>;
  }

  return (
    <div className="flex gap-4 h-[80vh] w-full">
      {/* LEFT */}
      <div className="w-[350px] shrink-0 overflow-y-auto pr-2 space-y-2 border-r border-gray-800">
        {videos.map((video, index) => {
          const isActive = index === currentIndex;

          const p = progressMap[video.videoId];

          //  correct percentage calculation
          const percent =
            video.duration && video.duration > 0
              ? Math.floor(((p?.watchedDuration || 0) / video.duration) * 100)
              : 0;

          return (
            <div
              key={video.videoId}
              onClick={() => setCurrentIndex(index)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                isActive
                  ? "bg-gray-600 border-gray-400"
                  : "bg-gray-900 hover:bg-gray-800 border-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Video {index + 1}</span>

                <span className="text-xs text-gray-400">
                  {formatDuration(video.duration ?? 0)}
                </span>
              </div>

              {/*  progress bar */}
              <div className="mt-2 h-1 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-gray-400 transition-all"
                  
                />
                <ProgressBar value={percent}/>
              </div>

              {/*  completed state */}
              {p?.completed && (
                <div className="text-green-400 text-xs mt-1">✓ Completed</div>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="flex-1 min-w-0">
        <YoutubePlayer
          videoId={videos[currentIndex].videoId}
          resourceId={resource._id}
          playlistMode={true}
          // resume from last position
          initialTime={
            progressMap[videos[currentIndex].videoId]?.lastPosition || 0
          }
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
