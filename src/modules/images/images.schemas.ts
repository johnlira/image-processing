import { z } from "zod";

export const imageDimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  format: z.string(),
});

export const createImageInputSchema = z.object({
  userId: z.uuid(),
  originalName: z.string().min(1).max(255),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1).max(50),
  size: z.number().positive(),
  dimensions: imageDimensionsSchema,
});

export type CreateImageInput = z.infer<typeof createImageInputSchema>;

export const imageOutputSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  original_name: z.string(),
  storage_key: z.string(),
  mime_type: z.string(),
  size: z.number(),
  dimensions: imageDimensionsSchema,
  created_at: z.coerce.date(),
});

export type ImageOutput = z.infer<typeof imageOutputSchema>;
