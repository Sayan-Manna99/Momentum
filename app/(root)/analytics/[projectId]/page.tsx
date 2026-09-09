"use client";

import { useEffect, useState, use } from "react";
import { AnalyticsStatCard } from "@/components/AnalyticsStatCard";
import { Layers, CheckCircle, Clock, FileText } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
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

type AnalyticsProps = {
  projectId: string;
};

const AnimatedBackground = () => {
  const items = [
    { id: 1, text: "+", left: "10%", top: "20%", animationDuration: "15s", animationDelay: "0s", fontSize: "3rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 2, text: "×", left: "80%", top: "15%", animationDuration: "25s", animationDelay: "2s", fontSize: "4rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 3, text: "÷", left: "40%", top: "60%", animationDuration: "20s", animationDelay: "5s", fontSize: "2.5rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 4, text: "=", left: "70%", top: "80%", animationDuration: "18s", animationDelay: "1s", fontSize: "3.5rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
    { id: 5, text: "%", left: "20%", top: "75%", animationDuration: "22s", animationDelay: "3s", fontSize: "5rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 6, text: "[]", left: "50%", top: "30%", animationDuration: "30s", animationDelay: "0s", fontSize: "3rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 7, text: "{}", left: "90%", top: "50%", animationDuration: "24s", animationDelay: "4s", fontSize: "3.5rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 8, text: "<>", left: "15%", top: "45%", animationDuration: "28s", animationDelay: "1s", fontSize: "2.5rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
    { id: 9, text: "0", left: "60%", top: "10%", animationDuration: "19s", animationDelay: "2s", fontSize: "2.8rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 10, text: "1", left: "85%", top: "85%", animationDuration: "26s", animationDelay: "6s", fontSize: "3.2rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 11, text: "■", left: "5%", top: "85%", animationDuration: "35s", animationDelay: "0s", fontSize: "2rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 12, text: "▲", left: "30%", top: "10%", animationDuration: "21s", animationDelay: "5s", fontSize: "2rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
    { id: 13, text: "●", left: "55%", top: "90%", animationDuration: "27s", animationDelay: "2s", fontSize: "2.5rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 14, text: "◆", left: "35%", top: "40%", animationDuration: "23s", animationDelay: "7s", fontSize: "3rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 15, text: "⬢", left: "75%", top: "40%", animationDuration: "32s", animationDelay: "1s", fontSize: "4rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 16, text: "≈", left: "25%", top: "55%", animationDuration: "17s", animationDelay: "4s", fontSize: "3.5rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-rotate {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.2; }
        }
      `}} />
      
      {/* Dark grid with faint glowing lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Soft radial gradient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Floating shapes */}
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute select-none font-mono flex items-center justify-center"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.fontSize,
            color: item.color,
            textShadow: item.textShadow,
            animation: `float-rotate ${item.animationDuration} infinite ease-in-out ${item.animationDelay}`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

function Analytics({ projectId }: AnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📈 Dummy weekly progress data (replace later with backend data)
  const weeklyData = [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 5 },
    { day: "Wed", value: 8 },
    { day: "Thu", value: 10 },
    { day: "Fri", value: 14 },
    { day: "Sat", value: 18 },
    { day: "Sun", value: 22 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics/${projectId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        No analytics data found
      </div>
    );
  }

  // 🥧 Pie chart data
  const pieData = [
    {
      name: "Completed",
      value: data.progress.completed,
    },
    {
      name: "In Progress",
      value: data.progress.inProgress,
    },
    {
      name: "Not Started",
      value: data.progress.notStarted,
    },
  ];

  // 📚 Resource breakdown data
  const resourceData = [
    {
      name: "Videos",
      value: data.overview.totalVideos,
    },
    {
      name: "PDFs",
      value: data.overview.totalPDFs,
    },
    {
      name: "Playlists",
      value: data.overview.totalPlaylists,
    },
  ];

  const PIE_COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full p-6">
        {/* 🔵 Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>

          <p className="text-muted-foreground mt-1">
            Real-time insights into your learning progress.
          </p>
        </div>

        <div className="space-y-8">
          {/* 🟩 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStatCard
              title="Total Resources"
              value={data.overview.totalResources}
              icon={<Layers size={22} />}
              valueColor="text-white"
              subtleColor="text-white/50 group-hover:text-white/70"
            />

            <AnalyticsStatCard
              title="Completed"
              value={data.progress.completed}
              icon={<CheckCircle size={22} />}
              valueColor="text-green-400"
              subtleColor="text-green-400/60 group-hover:text-green-400"
            />

            <AnalyticsStatCard
              title="In Progress"
              value={data.progress.inProgress}
              icon={<Clock size={22} />}
              valueColor="text-yellow-400"
              subtleColor="text-yellow-400/60 group-hover:text-yellow-400"
            />

            <AnalyticsStatCard
              title="Not Started"
              value={data.progress.notStarted}
              icon={<FileText size={22} />}
              valueColor="text-cyan-400"
              subtleColor="text-cyan-400/60 group-hover:text-cyan-400"
            />
          </div>

          {/* 🟨 Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 📈 LEFT: Weekly Progress */}
            <div className="lg:col-span-1 min-w-0 border border-white/10 rounded-2xl p-6 shadow-sm bg-neutral-400/20 backdrop-blur-lg">
              <h3 className="font-medium mb-4 text-white/80">
                Weekly Progress
              </h3>

              <ResponsiveContainer width="100%" aspect={2}>
                <LineChart data={weeklyData}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.10)"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: "rgba(255,255,255,0.55)" }}
                  />

                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: "rgba(255,255,255,0.55)" }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,30,35,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#3b82f6",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 🥧 RIGHT: Pie Chart */}
            <div className="lg:col-span-1 min-w-0 border border-white/10 rounded-2xl p-6 shadow-sm bg-neutral-400/20 backdrop-blur-lg">
              <h3 className="font-medium mb-4">Overall Completion</h3>

              <div className="w-full min-w-0">
                <ResponsiveContainer width="100%" aspect={1}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius="80%"
                      label={({ percent }) =>
                        `${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* 📚 Resource Breakdown */}

            <div className="lg:col-span-1 min-w-0 border border-white/10 rounded-2xl p-6 shadow-sm bg-neutral-400/20 backdrop-blur-lg">
              <h3 className="font-medium mb-4 text-white/80">
                Resource Breakdown
              </h3>

              <ResponsiveContainer width="100%" aspect={2.5}>
                <BarChart data={resourceData}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.10)"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: "rgba(255,255,255,0.55)" }}
                  />

                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: "rgba(255,255,255,0.55)" }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,30,35,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  />

                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const unwrappedParams = use(params);
  return <Analytics projectId={unwrappedParams.projectId} />;
}