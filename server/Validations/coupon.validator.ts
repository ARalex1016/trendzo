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

// Request-level schemas
export const validateCouponParamsSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

export const applyCouponBodySchema = z.object({
  code: z
    .string("Coupon code is required")
    .min(1, "Coupon code cannot be empty"),
  totalAmount: z.number().nonnegative("totalAmount must be >= 0"),
  isReferredUser: z.boolean().optional(),
  isFirstTimeUser: z.boolean().optional(),
});
