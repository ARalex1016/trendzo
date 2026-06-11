import { z } from "zod";

export const sizeTypes = ["alpha", "numeric", "shoe", "custom"] as const;

export const measurementSchema = z.object({
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  length: z.number().positive().optional(),
  height: z.number().positive().optional(),
  width: z.number().positive().optional(),
  depth: z.number().positive().optional(),
});

export const createSizeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Size name is required")
      .max(50, "Size name cannot exceed 50 characters"),

    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase and kebab-case",
      ),

    type: z.enum(sizeTypes, {
      error: "Invalid size type",
    }),

    measurements: measurementSchema.optional(),

    unit: z.enum(["cm", "inch"]).optional(),

    isActive: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    const hasMeasurements =
      data.measurements &&
      Object.values(data.measurements).some((value) => value !== undefined);

    if (hasMeasurements && !data.unit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unit"],
        message: "Unit is required when measurements are provided",
      });
    }

    if (data.type === "custom" && !hasMeasurements) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["measurements"],
        message: "At least one measurement is required for custom sizes",
      });
    }
  });

export type CreateSizeInput = z.infer<typeof createSizeSchema>;
