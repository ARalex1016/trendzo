import { useFormContext } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  InputFieldWithLabelNIcon,
  TextAreaiWithLabelNIcon,
} from "@/components/InputFields";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Types

// ✅ Infer only the fields we need
export const basicInfoSchema = addProductSchema.pick({
  name: true,
  slug: true,
  description: true,
});

export type BasicInfpSchemaType = z.infer<typeof basicInfoSchema>;

const Basicinfo = () => {
  const form = useFormContext<BasicInfpSchemaType>();

  const { firstErrorPath } = useFirstStepError<BasicInfpSchemaType>();

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <InputFieldWithLabelNIcon
                label="Product name"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="e.g. Oversized Cashmere Trench Coat"
                className="w-full!"
                labelClassName="text-foreground! font-medium"
              />

              {firstErrorPath === "name" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <InputFieldWithLabelNIcon
                label="URL slug"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="oversized-cashmere-trench-coat"
                className="w-full!"
                labelClassName="text-foreground! font-medium"
              />
              {firstErrorPath === "slug" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <TextAreaiWithLabelNIcon
                label="Description"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Write a compelling product description..."
                className="w-full!"
                labelClassName="text-foreground! font-medium"
              />

              {firstErrorPath === "description" && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default Basicinfo;
