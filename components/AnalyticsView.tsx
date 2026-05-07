"use client";

import { useState, useEffect } from "react";


type AnalyticsData = {
  overview: {
    totalResources: number;
    totalVideos: number;
    totalPDFs: number;
    totalPlaylists: number;
  };
  progress: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
};

export function AnalyticsView({ projectId }: { projectId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analytics/${projectId}`);
        if (!res.ok) throw new Error("API error");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    // 1. Page container: padding, center content, max width
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 2. Header section */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      </header>

      {/* 3. Stats Cards Section */}
      {/* Grid layout (responsive): 2 columns on small screens, 4 on large screens */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Total Resources</h3>
          <p className="text-3xl font-bold mt-2">{data?.overview?.totalResources || 0}</p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <p className="text-3xl font-bold mt-2">{data?.progress?.completed || 0}</p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
          <p className="text-3xl font-bold mt-2">{data?.progress?.inProgress || 0}</p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Not Started</h3>
          <p className="text-3xl font-bold mt-2">{data?.progress?.notStarted || 0}</p>
        </div>
      </section>

      {/* 4. Charts Section */}
      {/* 2 columns on desktop, stacked on mobile */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="border rounded-xl p-6 shadow-sm bg-card flex flex-col h-80">
          <h3 className="font-semibold mb-4">Progress Overview</h3>
          <div className="flex-1 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            {/* Pie Chart goes here */}
            <span>Pie Chart Placeholder</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="border rounded-xl p-6 shadow-sm bg-card flex flex-col h-80">
          <h3 className="font-semibold mb-4">Resource Breakdown</h3>
          <div className="flex-1 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            {/* Bar Chart goes here */}
            <span>Bar Chart Placeholder</span>
          </div>
        </div>
      </section>
      
      {/* Future components... */}
    </div>
  );
}