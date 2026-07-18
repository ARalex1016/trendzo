import { z } from "zod";

// Validation
import { objectIdSchema } from "./validation.ts";

// -----------------------------------
// Address Base Schema
// -----------------------------------
export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, "Label cannot exceed 50 characters")
    .optional(),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Full name is too long"),

  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(20, "Invalid phone number"),

  street: z
    .string()
    .trim()
    .min(2, "Street is required")
    .max(255, "Street is too long"),

  area: z.string().trim().max(255, "Area is too long").optional(),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City is too long"),

  state: z.string().trim().max(100, "State is too long").optional(),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(100, "Country is too long")
    .default("Nepal"),

  postalCode: z.string().trim().max(20, "Postal code is too long").optional(),

  landmark: z.string().trim().max(255, "Landmark is too long").optional(),

  isDefault: z.boolean().optional().default(false),
});

// -----------------------------------
// Add Address
// -----------------------------------
export const addAddressSchema = addressSchema;

// -----------------------------------
// Update Address
// -----------------------------------
export const updateAddressSchema = addressSchema.partial();

// -----------------------------------
// Params
// -----------------------------------
export const addressParamsSchema = z.object({
  addressId: objectIdSchema,
});

// -----------------------------------
// Types
// -----------------------------------
export type AddAddressInput = z.infer<typeof addAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressParamsInput = z.infer<typeof addressParamsSchema>;
