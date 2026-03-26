"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Progress = {
  progressPercentage: number;
  lastWatchedPosition: number;
};

export const useProgress = (resourceId: string) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resourceId) return;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/resources/${resourceId}/progress`);
        setProgress(res.data.data);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [resourceId]);

  return { progress, loading };
};
