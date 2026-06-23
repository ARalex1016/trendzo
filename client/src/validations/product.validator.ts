import { z } from "zod";

export const imageItemSchema = z.object({
  id: z.string().uuid(), // matches crypto.randomUUID()
  file: z.instanceof(File),
});

export const addProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  images: z
    .array(imageItemSchema)
    .min(1)
    .refine(
      (files) =>
        files.every((img) =>
          ["image/jpeg", "image/png", "image/webp"].includes(img.file.type),
        ),
      {
        message: "Only JPG, PNG, and WEBP images are allowed",
      },
    ),
  thumbnail: z.string().uuid().optional(),
  baseCostPrice: z.number().positive(),
  baseSellingPrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  specifications: z
    .object({
      weight: z.string().optional(),
      material: z.string().optional(),
      countryOfOrigin: z.string().optional(),
      warranty: z.string().optional(),
    })
    .optional(),
  colors: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
  sizes: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
  inventory: z.array(
    z.object({
      color: z.string().regex(/^[0-9a-fA-F]{24}$/),
      size: z.string().regex(/^[0-9a-fA-F]{24}$/),
      stock: z.number().min(0),
    }),
  ),
  categories: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type AddProductType = z.infer<typeof addProductSchema>;
