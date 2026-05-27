import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).min(1),
  thumbnail: z.string().optional(),
  baseCostPrice: z.number().positive(),
  baseSellingPrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  specifications: z
    .object({
      weight: z.number().optional(),
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
