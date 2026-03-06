import { useFormContext } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Validations
import { registerSchema } from "@/validations/user.validator";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// ✅ Infer only the fields we need
export const basicInfoStepSchema = registerSchema.pick({
  name: true,
  email: true,
  phone: true,
  referralCode: true,
});

type BasicInfoStepSchema = z.infer<typeof basicInfoStepSchema>;

const BasicInfoStep = () => {
  //   const {
  //     register,
  //     setValue,
  //     watch,
  //     formState: { errors },
  //   } = useFormContext<BasicInfoStepSchema>();

  const form = useFormContext<BasicInfoStepSchema>();

  const { firstErrorPath } = useFirstStepError<BasicInfoStepSchema>();

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2 gap-1">
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Name"
              />
              {firstErrorPath === "name" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2 gap-1">
              {/* <FormLabel>Email</FormLabel> */}
              <Input
                {...field}
                type="email"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Email"
              />
              {firstErrorPath === "email" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="col-span-2 gap-1">
              {/* <FormLabel>Phone</FormLabel> */}
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Phone Number"
              />
              {firstErrorPath === "phone" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              {/* <FormLabel>Referral Code</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Referral Code"
                readOnly
              />
              {firstErrorPath === "referralCode" && <FormMessage />}
            </FormItem>
          )}
        />
      </Form>
    </>
  );
};

export default BasicInfoStep;
