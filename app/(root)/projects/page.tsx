import { ProgressBar } from "@/components/projects/ProgressBar"
import { ProjectCard } from "@/components/projects/ProjectCard"

function Projects() {
  return (
    <>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      </div>

      <ProjectCard
        project={{
          _id: "1",
          title: "Data Structures & Algorithms",
          description: "Striver A2Z + Leetcode daily practice",

          // 🔹 Progress
          stats: {
            progressPercentage: 42,
            totalResources: 25,
            completedResources: 11,
          },

          // 🔹 Resource breakdown (IMPORTANT for icons)
          resourceStats: {
            video: 12,
            playlist: 5,
            pdf: 8,
          },

          // 🔹 Dates
          targetEndDate: "2026-04-15",

          // 🔹 Status
          isOverdue: false,

          // 🔹 Optional UI fields
          category: "coding",
          color: "#3B82F6",

          // 🔹 Extra flags
          isPinned: true,
          isFavorite: true,
        }}
      />
    </>
  );
}

export default Projects