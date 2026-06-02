import { useFormContext } from "react-hook-form";
import { z } from "zod";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Icons
import { DollarSign, TrendingUp } from "lucide-react";

// ✅ Infer only the fields we need
export const pricingSchema = addProductSchema.pick({
  baseCostPrice: true,
  baseSellingPrice: true,
  discount: true,
});

export type PricingSchemaType = z.infer<typeof pricingSchema>;

const Pricing = () => {
  const form = useFormContext<PricingSchemaType>();

  const { firstErrorPath } = useFirstStepError<PricingSchemaType>();

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="baseCostPrice"
            render={({ field }) => (
              <FormItem>
                <InputFieldWithLabelNIcon
                  label="Cost Price"
                  Icon={DollarSign}
                  {...field}
                  id="costPriceInput"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="0.00"
                  labelClassName="font-medium"
                />

                {firstErrorPath === "baseCostPrice" && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseSellingPrice"
            render={({ field }) => (
              <FormItem>
                <InputFieldWithLabelNIcon
                  label="Selling Price"
                  Icon={DollarSign}
                  {...field}
                  id="sellingPriceInput"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="0.00"
                  labelClassName="font-medium"
                />

                {firstErrorPath === "baseSellingPrice" && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <InputFieldWithLabelNIcon
                  label="Discount %"
                  {...field}
                  id="discountInput"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="0.00"
                  labelClassName="font-medium"
                />

                {firstErrorPath === "discount" && <FormMessage />}
              </FormItem>
            )}
          />
        </div>

        {/* Pricing summary */}
        <div className="bg-accent rounded-xl px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />

            <p className="text-white/80 font-medium">Profit Analysis</p>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Pricing;
