// src/validations/coupon.validation.ts
import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive("Coupon value must be greater than 0"),

  minPurchase: z.number().min(0).default(0),

  maxDiscount: z.number().optional(),

  applicableUsers: z.enum(["all", "firstTime", "referred"]).default("all"),

  expiryDate: z.coerce.date({ message: "Invalid expiry date format" }),

  usageLimit: z.number().optional().nullable(),

  status: z.enum(["active", "inactive"]).default("active"),
});

export const updateCouponSchema = createCouponSchema.partial();
