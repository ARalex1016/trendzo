import { z } from "zod";

export const orderItemSchema = z.object({
  product: z.string().length(24, "Invalid product ID"), // MongoDB ObjectId
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const placeOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  deliveryCharge: z.number().min(0).optional(),
  paymentMethod: z.enum(["bank", "esewa", "khalti", "cod"]),
  deliveryAddress: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(5, "Phone number is too short"),
    address: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City is too short"),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  orderNote: z.string().max(500).optional(),
  couponCode: z.string().optional(), // Added coupon code
});
