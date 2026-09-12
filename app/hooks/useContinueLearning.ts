"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface ContinueLearningItem {
  id: string;
  title: string;
  type: string;
  projectName?: string;
  progressPercentage: number;
  subtitle: string;
  lastAccessedAt: string;
}

export const useContinueLearning = () => {
  const [items, setItems] = useState<ContinueLearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/dashboard/continue-learning");
      const payload = res.data?.data ?? res.data;
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err: unknown) {
      console.error("Failed to fetch continue learning resources:", err);
      setError("Failed to load continue learning resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
};
