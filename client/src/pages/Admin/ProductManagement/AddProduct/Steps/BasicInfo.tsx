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

export type BasicInoSchemaType = z.infer<typeof basicInfoSchema>;

const Basicinfo = () => {
  const form = useFormContext<BasicInoSchemaType>();

  const { firstErrorPath } = useFirstStepError<BasicInoSchemaType>();

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
                id="nameInput"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="e.g. Oversized Cashmere Trench Coat"
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
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="slugInput"
                  className="text-sm text-foreground font-medium"
                >
                  URL Slug
                </label>

                <div className="bg-accent flex flex-row items-center gap-x-1 border border-border focus-within:border-primary rounded-md px-3">
                  <span className="text-foreground font-medium">
                    /products/
                  </span>

                  <input
                    id="slugInput"
                    type="text"
                    {...field}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="oversized-cashmere-trench-coat"
                    className="w-full text-foreground/80 outline-none! rounded-inherit py-2"
                  />
                </div>
              </div>

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
                id="descriptionInput"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Write a compelling product description..."
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
