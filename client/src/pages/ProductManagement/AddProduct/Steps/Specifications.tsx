import z from "zod";
import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem } from "@/components/ui/form";
import { InputFieldWithLabelNIconOutsie } from "@/components/InputFields";

// Icons
import { Package2, Weight, Globe, Shield } from "lucide-react";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// ✅ Infer only the fields we need
export const specificationsSchema = addProductSchema.pick({
  specifications: true,
});

export type SpecificationSchemaType = z.infer<typeof specificationsSchema>;

const Specifications = () => {
  const form = useFormContext<SpecificationSchemaType>();

  console.log(form.watch("specifications"));

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        <FormField
          control={form.control}
          name="specifications.weight"
          render={({ field }) => (
            <FormItem>
              <InputFieldWithLabelNIconOutsie
                label="Weight"
                Icon={Weight}
                placeholder="e.g. 200g, 1.5kg"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                labelClassName="font-medium!"
                inputClassName="text-sm"
                iconClassName="text-primary!"
                className="gap-y-1.5"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications.material"
          render={({ field }) => (
            <FormItem>
              <InputFieldWithLabelNIconOutsie
                label="Material"
                Icon={Package2}
                placeholder="e.g. 100% Cotton, Leather"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                labelClassName="font-medium!"
                inputClassName="text-sm"
                iconClassName="text-primary2!"
                className="gap-y-1.5"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications.countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <InputFieldWithLabelNIconOutsie
                label="Country of Origin"
                Icon={Globe}
                placeholder="e.g. USA, Italy, China"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                labelClassName="font-medium!"
                inputClassName="text-sm"
                iconClassName="text-success!"
                className="gap-y-1.5"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications.warranty"
          render={({ field }) => (
            <FormItem>
              <InputFieldWithLabelNIconOutsie
                label="Warranty Period"
                Icon={Shield}
                placeholder="e.g. 1 year, 6 months, Lifetime"
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                labelClassName="font-medium!"
                inputClassName="text-sm"
                iconClassName="text-cyan-400!"
                className="gap-y-1.5"
              />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default Specifications;
