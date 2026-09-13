"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface ActiveProjectItemData {
  id: string;
  title: string;
  totalResources: number;
  completedResources: number;
  progressPercentage: number;
  updatedAt: string;
}

export const useActiveProjects = () => {
  const [projects, setProjects] = useState<ActiveProjectItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/dashboard/active-projects");
      const payload = res.data?.data ?? res.data;
      setProjects(Array.isArray(payload) ? payload : []);
    } catch (err: unknown) {
      console.error("Failed to fetch active projects:", err);
      setError("Failed to load active projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
};
