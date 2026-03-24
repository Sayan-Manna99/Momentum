'use client';
import { useProjects } from "@/app/hooks/useProjects";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";

function Projects() {
   const { projects, loading ,setProjects} = useProjects();
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/*  GRID BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-size-[40px_40px]" />

        <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/20 to-black/40" />
      </div>
      {/*  CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-2 pb-10 space-y-8">
        {/* 🔹 Header */}
        <section className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <CreateProjectDialog  setProjects={setProjects}/>
        </section>

        {/*  Projects Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-400">No projects yet</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} setProjects={setProjects} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default Projects;
