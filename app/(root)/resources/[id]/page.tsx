"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { YoutubePlayer } from "@/components/resources/YouTubePlayer";
import { extractYoutubeData } from "@/lib/utils/youTube";
import { PlaylistView } from "@/components/resources/PlyListView";

type Params = Promise<{ id: string }>;

export default function ResourcePage({ params }: { params: Params }) {
  const [resource, setResource] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const loadResource = async () => {
      try {
        const { id } = await params;
        setResourceId(id);

        const [resourceRes, progressRes] = await Promise.all([
          axios.get(`/api/resources/${id}`),
          axios.get(`/api/resources/${id}/progress`),
        ]);

        setResource(resourceRes.data.data);
        setProgress(progressRes.data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load resource",
        );
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [params]);

  // 🔥 loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading resource...</p>
        </div>
      </div>
    );
  }

  // 🔥 error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
          <h3 className="text-red-500 font-semibold mb-2">Error</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  // 🔥 no resource
  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Resource not found</p>
      </div>
    );
  }

  // 🔥 PLAYLIST MODE
  if (resource.type === "youtube_playlist") {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">
            {resource.title}
          </h1>

          <PlaylistView resource={resource} progress={progress || {}} />
        </div>
      </div>
    );
  }

  // 🔥 VIDEO MODE
  let videoId: string | null = null;

  if (resource.type === "youtube_video") {
    videoId = resource.youtubeData?.videoId || null;
  } else if (resource.url) {
    const youtubeData = extractYoutubeData(resource.url);
    videoId = youtubeData?.videoId || null;
  }

  if (!videoId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6 max-w-md">
          <h3 className="text-yellow-500 font-semibold mb-2">
            Invalid Resource
          </h3>
          <p className="text-gray-300">
            No valid YouTube video ID found for this resource.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {resource.title}
          </h1>
          {resource.description && (
            <p className="text-gray-400">{resource.description}</p>
          )}
        </div>

        {/* 🔥 VIDEO PLAYER (FIXED) */}
        <div className="mb-8">
          <YoutubePlayer
            videoId={videoId}
            resourceId={resourceId || resource._id}
            initialTime={progress?.lastWatchedPosition || 0} // ✅ FIXED
            onProgressUpdate={setProgress} // ✅ LIVE UPDATE
          />
        </div>

        {/* Metadata */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Details</h2>

          <div className="space-y-2 text-sm">
            {resource.youtubeData?.channelTitle && (
              <div className="flex justify-between">
                <span className="text-gray-400">Channel:</span>
                <span className="text-white">
                  {resource.youtubeData.channelTitle}
                </span>
              </div>
            )}

            {resource.youtubeData?.duration && (
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">
                  {formatDuration(resource.youtubeData.duration)}
                </span>
              </div>
            )}

            {resource.category && (
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-white capitalize">
                  {resource.category}
                </span>
              </div>
            )}

            {resource.tags && resource.tags.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Tags:</span>
                <div className="flex gap-2">
                  {resource.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// helper
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
