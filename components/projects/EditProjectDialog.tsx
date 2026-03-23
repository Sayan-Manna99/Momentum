"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  CreateProjectData,
} from "@/lib/validators/project.validator";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const EditProjectDialog = ({ project, setOpen, setProjects }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),

    // 🔥 PREFILL DATA
    defaultValues: {
      title: project.title,
      description: project.description,
      targetEndDate: project.targetEndDate || "",
    },
  });

  const onSubmit = async (data: CreateProjectData) => {
    try {
      await axios.patch(`/api/projects/${project._id}`, data);

      // 🔥 OPTIMISTIC UPDATE
      setProjects((prev: Project[]) =>
        prev.map((p: Project) => (p._id === project._id ? { ...p, ...data } : p)),
      );

      setOpen(false);
  
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/60  flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-800 p-6 rounded-xl w-[400px] space-y-4"
      >
        <h2 className="text-lg font-semibold">Edit Project</h2>

        <input
          {...register("title")}
          className="w-full p-2 bg-gray-600 rounded"
        />

        <textarea
          {...register("description")}
          className="w-full p-2 bg-gray-600 rounded"
        />

        <input
          type="date"
          {...register("targetEndDate")}
          className="w-full p-2 bg-gray-600 rounded"
        />

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => setOpen(false)} className="bg-red-500">
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting} className="bg-blue-500">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};
