"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Video, ListVideo, FileText, Trash2, Pencil } from "lucide-react";
import { ProgressBar } from "@/components/projects/ProgressBar";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { EditResourceDialog } from "./EditResourseDialog";
import { useRouter } from "next/dist/client/components/navigation";
import { useProgress } from "@/app/hooks/useProgress";




export const ResourceCard = ({
  resource,
  setResources,
  
}: {
  resource: Resource ;
  setResources: React.Dispatch<React.SetStateAction<any[]>>;
  
}) => {
  
  const router = useRouter();
  console.log("Rendering ResourceCard for:", resource.title);
  console.log("Resource details:", resource);

  const { progress, loading } = useProgress(resource._id);
  const percentage = progress?.progressPercentage || 0;
  const [openEdit, setOpenEdit] = useState(false);
  const handleEdit = async (e: any) => {
     e.preventDefault();
     e.stopPropagation();

      setOpenEdit(true);
   
  }
  const handleDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await axios.delete(`/api/resources/${resource._id}`);
      if (res.data.success) {
        setResources((prev: Resource[]) =>
          prev.filter((r: Resource) => r._id !== resource._id),
        );

        toast.success("Resource deleted");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };
  const getIcon = () => {
    if (resource.type === "youtube_video")
      return <Video className="text-red-500" size={16} />;
    if (resource.type === "youtube_playlist")
      return <ListVideo className="text-purple-500" size={16} />;
    if (resource.type === "pdf")
      return <FileText className="text-green-500" size={16} />;
  };
  const getDuration = () => {
    if (resource.type === "youtube_video" && resource?.totalDuration)
      return formatDuration(resource.totalDuration);
    if (resource.type === "youtube_playlist" && resource?.totalDuration)
      return formatDuration(resource.totalDuration);
    if (resource.type === "pdf" && resource.pdfData?.pageCount)
      return `${resource.pdfData.pageCount} pages`;
    return "";
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const hours = Math.floor(minutes / 60);
    const seconds = duration % 60;
    return `${hours}h ${minutes % 60}m ${seconds}s`;
  };

  return (
    <>
      <Card className="bg-neutral-400/20 hover:bg-neutral-400/30 transition-colors text-neutral-300 border border-neutral-400/20">
        <CardContent className="p-4 space-y-3">
          {/* 🔹 Title */}
          <div className="flex items-center gap-2">
            {getIcon()}
            <h3
              onClick={() => router.push(`/resources/${resource._id}`)}
              className="text-sm font-semibold text-white"
            >
              {resource.title || "Untitled"}
            </h3>
          </div>

          {/* 🔹 Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{percentage || 0}%</span>
            </div>

            <ProgressBar value={percentage || 0} />
          </div>
          {/* 🔹 Meta */}
          <div className="flex items-center justify-between gap-4 text-xs text-gray-400">
            <div className="text-xs text-gray-400">{getDuration()}</div>
            <div className="flex gap-2 opacity-70">
              <Button
                variant="ghost"
                onClick={(e) => {
                  handleEdit(e);
                }}
              >
                <Pencil className="text-blue-500" size={14} />
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-500 hover:bg-red-500/20"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <EditResourceDialog
        resource={resource}
        open={openEdit}
        setOpen={setOpenEdit}
        setResources={setResources}
      />
    </>
  );
};
