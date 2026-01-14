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
  id: z.string(),
  userId: z.string(),
  originalName: z.string(),
  storageKey: z.string(),
  mimeType: z.string(),
  size: z.number(),
  dimensions: imageDimensionsSchema,
  createdAt: z.date(),
  url: z.string().optional(),
});

export type ImageOutput = z.infer<typeof imageOutputSchema>;
