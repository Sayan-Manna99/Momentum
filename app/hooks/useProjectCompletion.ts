"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface ProjectCompletionData {
  completionPercentage: number;
  completedResources: number;
  totalResources: number;
  completedProjects: number;
  totalProjects: number;
  projectsCompletionPercentage: number;
}

export const useProjectCompletion = () => {
  const [data, setData] = useState<ProjectCompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletion = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/dashboard/completion");
      const payload = res.data?.data ?? res.data;
      setData({
        completionPercentage: payload?.completionPercentage ?? 0,
        completedResources: payload?.completedResources ?? 0,
        totalResources: payload?.totalResources ?? 0,
        completedProjects: payload?.completedProjects ?? 0,
        totalProjects: payload?.totalProjects ?? 0,
        projectsCompletionPercentage: payload?.projectsCompletionPercentage ?? 0,
      });
    } catch (err: unknown) {
      console.error("Failed to fetch project completion stats:", err);
      setError("Failed to load project completion data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletion();
  }, []);

  return {
    completionPercentage: data?.completionPercentage ?? 0,
    completedResources: data?.completedResources ?? 0,
    totalResources: data?.totalResources ?? 0,
    completedProjects: data?.completedProjects ?? 0,
    totalProjects: data?.totalProjects ?? 0,
    projectsCompletionPercentage: data?.projectsCompletionPercentage ?? 0,
    loading,
    error,
    refetch: fetchCompletion,
  };
};
