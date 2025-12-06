import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  specifications: z
    .object({
      weight: z.number().optional(),
      material: z.string().optional(),
      countryOfOrigin: z.string().optional(),
      warranty: z.string().optional(),
    })
    .optional(),

  variants: z
    .array(
      z.object({
        color: z.string(),
        images: z.array(z.string()).min(1),
        basePrice: z.number().positive().optional(),

        sizes: z.array(
          z.object({
            size: z.string(),
            stock: z.number().min(0).optional(),
            price: z.number().positive().optional(),
          })
        ),
      })
    )
    .optional(),

  categories: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});
