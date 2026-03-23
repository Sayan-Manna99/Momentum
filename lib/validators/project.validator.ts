import { z } from "zod";


export const createProjectSchema = z.object({
  title: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(50, "Project name must be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(250, "Description must be at most 250 characters")
    .optional(),
  targetEndDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date",
    })
    .refine(
      (date) => {
        if (!date) return true;

        const inputDate = new Date(date);
        const today = new Date();

        // normalize both to midnight
        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        return inputDate >= today;
      },
      {
        message: "Date cannot be in the past",
      },
    ),
  status: z.enum(["planning", "in_progress", "completed"]).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(["planning", "in_progress", "completed"]).optional(),
});
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;