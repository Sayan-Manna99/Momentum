"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface RecentActivityItem {
  id: string;
  type:
    | "completed_video"
    | "completed_pdf"
    | "started_reading"
    | "started_video"
    | "project_created";
  action: string;
  title: string;
  timestamp: string;
  icon?: string;
}

export const useRecentActivity = () => {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/dashboard/recent-activity");
      const payload = res.data?.data ?? res.data;
      setActivities(Array.isArray(payload) ? payload : []);
    } catch (err: unknown) {
      console.error("Failed to fetch recent activities:", err);
      setError("Failed to load recent activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
};
