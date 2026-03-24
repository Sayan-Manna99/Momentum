"use client";

import { useProjectDetails } from "@/app/hooks/useProjectDetails";
import { CreateResourceDialog } from "@/components/resources/CreateResourseDialog";
import { ResourceCard } from "@/components/resources/resourceCard";
import { useParams } from "next/navigation";

function ProjectDetailsPage() {
  const { id } = useParams();
  const { project, resources,setResources} = useProjectDetails(id as string);
  return (
    <div className="relative min-h-screen p-6 space-y-6  bg-gray-950 text-white overflow-hidden">
      {/*  GRID BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-size-[40px_40px]" />

        <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-black/40 via-black/20 to-black/40" />
      </div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{project?.title}</h1>
            <p className="text-gray-400">{project?.description}</p>
          </div>
          <div>
            <CreateResourceDialog
              projectId={id as string}
              setResources={setResources}
              
            />
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-xl font-semibold mb-2 mt-4">Resources</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <ResourceCard key={r._id?.toString()} resource={r} setResources={setResources} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
