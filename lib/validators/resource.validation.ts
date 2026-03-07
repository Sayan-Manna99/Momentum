import { z } from "zod";
import { ResourceStatus, ResourceType } from "../db/models/Resource.model";

export const createResourceSchema = z.object({
  title: z.string().min(3),

  type: z.enum(ResourceType),

  url: z.string().optional(),

  description: z.string().optional(),

  tags: z.array(z.string()).optional(),
});

export const updateResourceSchema = z.object({
  title: z.string().min(3).optional(),

  description: z.string().optional(),

  tags: z.array(z.string()).optional(),

  status: z.enum(ResourceStatus).optional(),

  notes: z.string().max(5000).optional(),

  rating: z.number().min(0).max(5).optional(),

  isFavorite: z.boolean().optional(),

  order: z.number().optional(),
});

export type UpdateResourceData = z.infer<typeof updateResourceSchema>;
export type CreateResourceData = z.infer<typeof createResourceSchema>;
