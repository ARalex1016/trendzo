import z from "zod";

export const addAddressSchema = z.object({
  address: z.object({
    _id: z.string().optional(),
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
    isDefault: z.boolean(),
  }),
});

export type AddAddressSchemaType = z.infer<typeof addAddressSchema>;
