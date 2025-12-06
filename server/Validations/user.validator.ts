import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(7).max(15),
    password: z
      .string()
      .min(6, "Password must be more than 6 characters")
      .max(20, "Password must be less than 20 characters"),
    confirmPassword: z.string(),
    role: z
      .enum(["user", "operator"], "Role must be either 'user' or 'operator'")
      .optional(), // prevent admin here
    address: z.object({
      label: z.string().optional(),
      street: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional().default("Nepal"),
      postalCode: z.string().optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
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
