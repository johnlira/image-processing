import { pool } from "../../lib/database";
import { CreateImageInput, ImageOutput, imageOutputSchema } from "./images.schemas";
import AppError from "../../errors/app-errors";

export const imagesRepository = {
  create: async (data: CreateImageInput): Promise<ImageOutput> => {
    const { userId, originalName, storageKey, mimeType, size, dimensions } = data;

    const result = await pool.query(
      `INSERT INTO images (user_id, original_name, storage_key, mime_type, size, dimensions)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, original_name, storage_key, mime_type, size, dimensions, created_at`,
      [userId, originalName, storageKey, mimeType, size, JSON.stringify(dimensions)]
    );

    if (result.rows.length === 0) {
      throw new AppError("Failed to create image", 500, "FAILED_TO_CREATE_IMAGE");
    }

    const image = imageOutputSchema.parse({
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      originalName: result.rows[0].original_name,
      storageKey: result.rows[0].storage_key,
      mimeType: result.rows[0].mime_type,
      size: result.rows[0].size,
      dimensions:
        typeof result.rows[0].dimensions === "string"
          ? JSON.parse(result.rows[0].dimensions)
          : result.rows[0].dimensions,
      createdAt: result.rows[0].created_at,
    });

    return image;
  },

  findById: async (id: string): Promise<ImageOutput | null> => {
    const result = await pool.query(
      "SELECT id, user_id, original_name, storage_key, mime_type, size, dimensions, created_at FROM images WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return imageOutputSchema.parse({
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      originalName: result.rows[0].original_name,
      storageKey: result.rows[0].storage_key,
      mimeType: result.rows[0].mime_type,
      size: result.rows[0].size,
      dimensions:
        typeof result.rows[0].dimensions === "string" ? JSON.parse(result.rows[0].dimensions) : result.rows[0].dimensions,
      createdAt: result.rows[0].created_at,
    });
  },

  findByUserId: async (userId: string): Promise<ImageOutput[]> => {
    const result = await pool.query(
      "SELECT id, user_id, original_name, storage_key, mime_type, size, dimensions, created_at FROM images WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return result.rows.map((row) =>
      imageOutputSchema.parse({
        id: row.id,
        userId: row.user_id,
        originalName: row.original_name,
        storageKey: row.storage_key,
        mimeType: row.mime_type,
        size: row.size,
        dimensions:
          typeof row.dimensions === "string" ? JSON.parse(row.dimensions) : row.dimensions,
        createdAt: row.created_at,
      })
    );
  },

  findByUserIdAndStorageKey: async (userId: string, storageKey: string): Promise<ImageOutput | null> => {
    const result = await pool.query(
      "SELECT id, user_id, original_name, storage_key, mime_type, size, dimensions, created_at FROM images WHERE user_id = $1 AND storage_key = $2",
      [userId, storageKey]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return imageOutputSchema.parse({
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      originalName: result.rows[0].original_name,
      storageKey: result.rows[0].storage_key,
      mimeType: result.rows[0].mime_type,
      size: result.rows[0].size,
      dimensions:
        typeof result.rows[0].dimensions === "string" ? JSON.parse(result.rows[0].dimensions) : result.rows[0].dimensions,
      createdAt: result.rows[0].created_at,
    });
  },

  delete: async (id: string, userId: string): Promise<boolean> => {
    const result = await pool.query(
      "DELETE FROM images WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return result.rowCount !== null && result.rowCount > 0;
  },
};
