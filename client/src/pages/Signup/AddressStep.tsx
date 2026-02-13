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
export const addressStepSchema = registerSchema.pick({
  address: true,
});

type AddressStepSchema = z.infer<typeof addressStepSchema>;

const AddressStep = () => {
  const form = useFormContext<AddressStepSchema>();

  const { firstErrorPath } = useFirstStepError<AddressStepSchema>();

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="address.country"
          render={({ field }) => (
            <FormItem className="gap-1">
              {/* <FormLabel>City</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Country"
              />
              {firstErrorPath === "address.country" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem className="gap-1">
              {/* <FormLabel>City</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="City"
              />

              {firstErrorPath === "address.city" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.postalCode"
          render={({ field }) => (
            <FormItem className="gap-1">
              {/* <FormLabel>City</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Postal Code"
              />
              {firstErrorPath === "address.postalCode" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.state"
          render={({ field }) => (
            <FormItem className="gap-1">
              {/* <FormLabel>City</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="State"
              />
              {firstErrorPath === "address.state" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem className="col-span-2 gap-1">
              {/* <FormLabel>City</FormLabel> */}
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Street"
              />
              {firstErrorPath === "address.street" && <FormMessage />}
            </FormItem>
          )}
        />
      </Form>
    </>
  );
};

export default AddressStep;
