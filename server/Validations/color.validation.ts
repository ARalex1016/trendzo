import { z } from "zod";

export const createColorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color name is required")
    .max(50, "Color name cannot exceed 50 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and kebab-case",
    ),

  hexCode: z
    .string()
    .trim()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid HEX color code"),

  rgb: z
    .string()
    .trim()
    .regex(
      /^rgb\(\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*\)$/,
      "Invalid RGB format. Example: rgb(255, 255, 255)",
    )
    .optional(),

  isActive: z.boolean().optional().default(true),
});

export type CreateColorInput = z.infer<typeof createColorSchema>;

export const updateColorSchema = createColorSchema.partial();
