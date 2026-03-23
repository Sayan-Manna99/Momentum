'use client';
import { useState } from "react";
import {Button} from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import axios from "axios";
import { CreateProjectData, createProjectSchema } from "@/lib/validators/project.validator";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import InputField from "../forms/InputField";


export const CreateProjectDialog = ({
  setProjects,
}: {
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) => {
 
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectData>({
    defaultValues: {
      title: "",
      description: "",
      targetEndDate: "",
    },
    resolver: zodResolver(createProjectSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateProjectData) => {
    try {
      const res = await axios.post("/api/projects", {
        ...data,
        targetEndDate: data.targetEndDate || undefined,
      });
      
      if (!res.data) {
        toast.error("Failed to create project");
        return;
      }
      const newProject = {
        ...res.data,
        stats: {
          totalResources: 0,
          completedResources: 0,
          progressPercentage: 0,
        },
        resourceStats: {
          video: 0,
          playlist: 0,
          pdf: 0,
        },
        isOverdue: false,
      };

      setProjects((prev) => [newProject, ...prev]);
      toast.success("Project created successfully");
    } catch (error) {
      console.log("Failed to create project", error);
      toast.error("Failed to create project");
    } finally {
      reset();
      setOpen(false);
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)} className="blue-btn">
        + New Project
      </Button>

      {open && (
        <div className="fixed inset-0 bg-gray-500/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-neutral-800 border border-white/10 p-6 rounded-xl w-[400px] space-y-4"
          >
            <h2 className="text-lg font-semibold">Create Project</h2>

            {/* Title */}
            
            <InputField
              name="title"
              label="Title"
              placeholder="Project Title"
              type="text"
              register={register}
              error={errors.title}
              className="w-full p-2 bg-gray-600 rounded"
            />
            {/* Description */}
            
            <InputField
              name="description"
              label="Description"
              placeholder="Project Description"
              type="text"
              register={register}
              error={errors.description}
              className="w-full p-2 bg-gray-600 rounded"
            />
            {/* Date */}
            
            <InputField
              name="targetEndDate"
              label="Target End Date"
              placeholder="Select a date"
              type="date"
              register={register}
              error={errors.targetEndDate}
              className="w-full p-2 bg-gray-600 rounded"
            />
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="bg-red-600"
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting} className="bg-blue-600">
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};