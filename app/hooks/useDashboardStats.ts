"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface DashboardStatsData {
  activeProjects: number;
  videosWatched: number;
  pdfsCompleted: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/dashboard/stats");
      const payload = res.data?.data ?? res.data;
      setStats({
        activeProjects: payload?.activeProjects ?? 0,
        videosWatched: payload?.videosWatched ?? 0,
        pdfsCompleted: payload?.pdfsCompleted ?? 0,
      });
    } catch (err: unknown) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
