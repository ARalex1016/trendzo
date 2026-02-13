import { useFormContext } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import StrongPasswordInput from "@/components/ui/strongPassword";
import PasswordInput from "@/components/ui/password";

// Validations
// import { registerSchema } from "@/validations/user.validator";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// ✅ Infer only the fields we need
// export const securityStepSchema = registerSchema
//   .pick({
//     password: true,
//     confirmPassword: true,
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

export const securityStepSchema = z
  .object({
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be less than 20 characters")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/\d/, "Password must contain at least 1 number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      ),

    confirmPassword: z.string("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SecurityStepSchema = z.infer<typeof securityStepSchema>;

const SecurityStep = () => {
  const form = useFormContext<SecurityStepSchema>();

  const { firstErrorPath } = useFirstStepError<SecurityStepSchema>();

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-2 gap-1">
              {/* <FormLabel>Password</FormLabel> */}
              {/* <Input {...field} type="password" placeholder="Password" /> */}
              {/* {firstErrorPath === "password" && <FormMessage />} */}

              <StrongPasswordInput
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="col-span-2 gap-1">
              {/* <FormLabel>Password</FormLabel> */}

              <PasswordInput
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Confirm Password"
              />
              {firstErrorPath === "confirmPassword" && <FormMessage />}
            </FormItem>
          )}
        />
      </Form>
    </>
  );
};

export default SecurityStep;
