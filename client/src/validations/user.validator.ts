import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string("Name is required").trim().min(2, "Name is required"),
    email: z.string("Email is required").trim().email("Invalid email address"),
    phone: z
      .string("Phone number is required")
      .trim()
      .min(7, "Phone number must be at least 7 digits")
      .max(15, "Phone number must be at most 15 digits"),
    password: z
      .string("Password is required")
      .trim()
      .min(6, "Password must be more than 6 characters")
      .max(20, "Password must be less than 20 characters"),
    confirmPassword: z.string("Please confirm your password").trim(),
    role: z.enum(["customer"], "Role must 'customer'").optional(), // prevent admin here
    address: z.object({
      label: z.string().trim().optional(),
      fullName: z.string().trim(),
      phone: z.string().trim(),
      email: z.string().trim(),
      country: z
        .string("Country is required")
        .trim()
        .optional()
        .default("Nepal"),
      city: z.string("City is required").trim().optional(),
      postalCode: z.string("Postal Code is required").optional(),
      state: z.string("State is required").optional(),
      street: z.string("Street address is required"),
      area: z.string().optional(),
      landmark: z.string().optional(),
    }),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string("Email is required").trim().email("Invalid email address"),
  password: z
    .string("Password is required")
    .trim()
    .min(6, "Password must be more than 6 characters")
    .max(20, "Password must be less than 20 characters"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserRegisterType = z.infer<typeof registerSchema>;
export type UserLoginType = z.infer<typeof loginSchema>;
