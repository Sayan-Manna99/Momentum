"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { Calendar, FileText, ListVideo, Video,Pencil,Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export const ProjectCard = ({ project }: any) => {
  const onEdit = () => {
    // Future: Implement edit functionality
    alert("Edit functionality coming soon!");
  };
  const onDelete = () => {
    // Future: Implement delete functionality
    alert("Delete functionality coming soon!");
  };
  return (
    <Link href={`/dashboard/projects/${project._id}`}>
      <Card className="bg-neutral-400/20 hover:bg-neutral-400/30 transition-colors text-neutral-300 backdrop-blur-[1px] border border-neutral-400/20 w-100">
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
              <Video size={14} />
              <span>{project.resourceStats.video || 0}</span>
            </div>

            <div className="flex items-center gap-1">
              <ListVideo size={14} />
              <span>{project.resourceStats.playlist || 0}</span>
            </div>

            <div className="flex items-center gap-1">
              <FileText size={14} />
              <span>{project.resourceStats.pdf || 0}</span>
            </div>

            {/* Optional badge */}
            {project.isOverdue && (
              <span className="text-red-400 text-xs">Overdue</span>
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
              {project.stats.completedResources || 0} of {project.stats.totalResources   || 0}{" "}
              resources completed
            </p>
          </div>

          {/* 🔹 Footer */}
          <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Due {project.targetEndDate || "N/A"}</span>
            </div>

            {/* Future: edit/delete */}
            <div className="flex gap-2 opacity-70">
              <Button onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}>
                <Trash2 size={14} />
              </Button>
              <Button onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}>
                <Pencil size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};