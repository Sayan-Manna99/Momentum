import { z } from "zod";
import { ResourceStatus } from "../db/models/Resource.model";

const videoResourceSchema = z.object({
  type: z.literal("youtube_video"),
  title: z.string().min(3),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
});

const playlistResourceSchema = z.object({
  type: z.literal("youtube_playlist"),
  title: z.string().min(3),
  url: z.string().url(),
  videoCount: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

const pdfResourceSchema = z.object({
  type: z.literal("pdf"),
  title: z.string().min(3),
  file: z.instanceof(File),
});

export const createResourceSchema = z.discriminatedUnion("type", [
  videoResourceSchema,
  playlistResourceSchema,
  pdfResourceSchema,
]);

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

export type VideoResourceData = z.infer<typeof videoResourceSchema>;
export type PlaylistResourceData = z.infer<typeof playlistResourceSchema>;
export type PdfResourceData = z.infer<typeof pdfResourceSchema>;
export type CreateResourceData = z.infer<typeof createResourceSchema>;
export type CreatePlaylistResourceData = PlaylistResourceData;
export type UpdateResourceData = z.infer<typeof updateResourceSchema>;
