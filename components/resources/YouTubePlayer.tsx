"use client";

import { useEffect, useMemo, useRef } from "react";
import axios from "axios";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

let youtubeAPIReady = false;

export const YoutubePlayer = ({
  videoId,
  resourceId,
  initialTime = 0,
  onEnd,
  onProgressUpdate,
}: {
  videoId: string;
  resourceId: string;
  initialTime?: number;
  onEnd?: () => void;
  onProgressUpdate?: (progress: any) => void; // ✅ FIXED TYPE
}) => {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSentRef = useRef(0);

  const playerId = useMemo(() => `yt-player-${resourceId}`, [resourceId]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT?.Player) {
          youtubeAPIReady = true;
          resolve();
          return;
        }

        const existingScript = document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]',
        );

        if (existingScript) {
          window.onYouTubeIframeAPIReady = () => {
            youtubeAPIReady = true;
            resolve();
          };
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;

        tag.onerror = () => {
          console.error("Failed to load YouTube API");
        };

        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
          youtubeAPIReady = true;
          resolve();
        };
      });
    };

    const stopTracking = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const startTracking = () => {
      if (intervalRef.current) return;

      console.log("START TRACKING");

      intervalRef.current = setInterval(async () => {
        if (!playerRef.current?.getCurrentTime) return;

        const currentTime = Math.floor(playerRef.current.getCurrentTime());

        if (Math.abs(currentTime - lastSentRef.current) < 3) return;

        lastSentRef.current = currentTime;

        try {
          const res = await axios.patch(`/api/progress`, {
            position: currentTime,
            resourceId,
          });

          const progress = res.data.data;

          console.log("PATCH SUCCESS:", progress);

        } catch (err) {
          console.error("Progress update failed:", err);
        }
      }, 5000);
    };

    const onPlayerStateChange = (event: any) => {
      console.log("STATE:", event.data);

      if (event.data === window.YT.PlayerState.PLAYING) {
        startTracking();
      }

      if (event.data === window.YT.PlayerState.ENDED) {
        stopTracking();
        onEnd?.();
      }
    };

    const initPlayer = async () => {
      try {
        await loadYouTubeAPI();

        const element = document.getElementById(playerId);
        if (!element) {
          console.log("ELEMENT NOT FOUND");
          return;
        }

        playerRef.current = new window.YT.Player(playerId, {
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              console.log("PLAYER READY");

              if (initialTime > 0) {
                event.target.seekTo(initialTime);
              }
            },
            onStateChange: onPlayerStateChange,
            onError: (event: any) => {
              console.error("YouTube player error:", event.data);
            },
          },
        });

        console.log("INIT PLAYER CALLED");
      } catch (error) {
        console.error("Failed to initialize player:", error);
      }
    };

    initPlayer();

    return () => {
      stopTracking();
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, resourceId, initialTime, playerId, onEnd, onProgressUpdate]);

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <div id={playerId} className="w-full h-full" />
    </div>
  );
};
