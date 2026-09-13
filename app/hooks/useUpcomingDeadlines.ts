"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { UpcomingDeadlineItem } from "@/lib/services/dashboard.service";

interface UseUpcomingDeadlinesReturn {
  deadlines: UpcomingDeadlineItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUpcomingDeadlines = (): UseUpcomingDeadlinesReturn => {
  const [deadlines, setDeadlines] = useState<UpcomingDeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("/api/dashboard/upcoming-deadlines");

      if (res.status === 200) {
        setDeadlines(res.data?.data ?? res.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch deadlines";
      setError(errorMessage);
      console.error("Error fetching deadlines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  return { deadlines, loading, error, refetch: fetchDeadlines };
};
