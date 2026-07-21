import { z } from "zod";

// MongoDB ObjectId validator
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Single order item
export const orderItemSchema = z.object({
  product: objectId,

  color: objectId,

  size: objectId,

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be at least 1"),
});

// Online order validation
export const placeOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),

  paymentMethod: z.enum(["bank", "esewa", "khalti", "cod"]),

  deliveryAddress: z.object({
    name: z.string().min(1, "Name is required"),

    phone: z
      .string()
      .min(5, "Phone number is too short")
      .max(20, "Phone number is too long"),

    address: z.string().min(5, "Address is too short"),

    city: z.string().min(2, "City is too short"),

    postalCode: z.string().optional(),

    country: z.string().optional(),
  }),

  orderNote: z
    .string()
    .max(500, "Order note cannot exceed 500 characters")
    .optional(),

  couponCode: z.string().optional(),
});

// In-store POS order validation
export const placeStoreOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),

  paymentMethod: z.enum(["bank", "esewa", "khalti", "cash"]),

  orderNote: z
    .string()
    .max(500, "Order note cannot exceed 500 characters")
    .optional(),

  couponCode: z.string().optional(),
});
