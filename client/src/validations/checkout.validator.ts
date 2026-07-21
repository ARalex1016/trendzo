import { z } from "zod";

export const userStepSchema = z.object({
  user: z.object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    phone: z
      .string()
      .min(5, "Phone number is too short")
      .max(20, "Phone number is too long"),
    email: z.string().email("Invalid email address"),
  }),
});

export const addressStepSchema = z.object({
  deliveryAddress: z.object({
    _id: z.string().min(1, "Please select a delivery address"),
    label: z.string().max(30, "Label is too long").optional(),
    fullName: z.string().min(2, "Recipient name is required"),
    phone: z
      .string()
      .min(5, "Phone number is too short")
      .max(20, "Phone number is too long"),
    street: z.string().min(5, "Street address is too short"),
    area: z.string().optional(),
    city: z.string().min(2, "City is too short"),
    state: z.string().min(2, "State is too short"),
    country: z.string().optional(),
    postalCode: z.string().min(2, "Postal code is required"),
    landmark: z.string().optional(),
  }),
});

export const paymentStepSchema = z.object({
  paymentMethod: z.enum(["bank", "esewa", "khalti", "cod"]),
  orderNote: z
    .string()
    .max(500, "Order note cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  couponCode: z
    .string()
    .max(50, "Coupon code is too long")
    .optional()
    .or(z.literal("")),
});

export const checkoutSchema = z.object({
  user: userStepSchema.shape.user,
  deliveryAddress: addressStepSchema.shape.deliveryAddress,
  paymentMethod: paymentStepSchema.shape.paymentMethod,
  orderNote: paymentStepSchema.shape.orderNote,
  couponCode: paymentStepSchema.shape.couponCode,
});

export type UserStepSchemaType = z.infer<typeof userStepSchema>;
export type AddressStepSchemaType = z.infer<typeof addressStepSchema>;
export type PaymentStepSchemaType = z.infer<typeof paymentStepSchema>;
export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
