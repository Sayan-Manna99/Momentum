"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { Calendar, FileText, ListVideo, Video,Pencil,Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

import { EditProjectDialog } from "./EditProjectDialog";


export const ProjectCard = ({
  project,
  setProjects,
}: {
  project: Project;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const onEdit = () => {
   try {
      setOpenEdit(true);
      
   } catch (error) {
      console.error("Failed to edit project", error);
      toast.error("Failed to edit project");
   }
  };
  const onDelete = async () => {
    try {
      const response = await axios.delete(`/api/projects/${project._id}`);
      if (!response.data.success) {
        toast.error(response.data.message || "Failed to delete project");
        return;
      }
      // Remove the deleted project from the list
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    }
  };
  return (
    <>
    <Link href={`/projects/${project._id}`}>
      <Card className="bg-neutral-400/20 hover:bg-neutral-400/30 transition-colors text-neutral-300 backdrop-blur-[1px] border border-neutral-400/20 w-full">
        <CardContent className="p-4 space-y-4">
          {/* 🔹 Title + Description */}
          <div>
            <h2 className="text-lg font-semibold text-white">
              {project.title}
            </h2>
            <p className="text-sm text-gray-400">
              {project.description || "No description"}
            </p>
          </div>

          {/* 🔹 Meta Row */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Video className="text-red-500" size={14} />
              <span>{project.resourceStats?.video || 0}</span>
            </div>

            <div className="flex items-center gap-1">
              <ListVideo className="text-purple-500" size={14} />
              <span>{project.resourceStats?.playlist || 0}</span>
            </div>

            <div className="flex items-center gap-1">
              <FileText className="text-green-500" size={14} />
              <span>{project.resourceStats?.pdf || 0}</span>
            </div>

            {/* Optional badge */}
            {project.isOverdue && (
              <span className="text-red-600 text-xs">Overdue</span>
            )}
          </div>

          {/* 🔹 Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Progress</span>
              <span>{project.stats.progressPercentage ?? 0}%</span>
            </div>

            <ProgressBar value={project.stats.progressPercentage ?? 0} />

            <p className="text-xs text-gray-400">
              {project.stats.completedResources || 0} of{" "}
              {project.stats.totalResources || 0} resources completed
            </p>
          </div>

          {/* 🔹 Footer */}
          <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Due{" "}
                {project.targetEndDate
                  ? new Date(project.targetEndDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            
            {/* Future: edit/delete */}
            <div className="flex gap-2 opacity-70">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="text-blue-500" size={14} />
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="text-red-500" size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    {openEdit && (
              <EditProjectDialog
                project={project}
                setOpen={setOpenEdit}
                setProjects={setProjects}
              />
            )}

        </>
  );
};