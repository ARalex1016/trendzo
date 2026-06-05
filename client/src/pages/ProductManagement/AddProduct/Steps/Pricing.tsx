import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { cva, type VariantProps } from "class-variance-authority";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Validations
import { addProductSchema } from "@/validations/product.validator";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Utils
import { formatNepaliAmount } from "@/utils/NumberManager";

// Icons
import {
  DollarSign,
  Percent,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

// Config
import { BRAND } from "@/config/brand";

// ✅ Infer only the fields we need
export const pricingSchema = addProductSchema.pick({
  baseCostPrice: true,
  baseSellingPrice: true,
  discount: true,
});

export type PricingSchemaType = z.infer<typeof pricingSchema>;

const valueVariants = cva("text-base font-medium", {
  variants: {
    variant: {
      default: "text-foreground",
      special: "text-primary-gradient",
      success: "text-green-500",
      danger: "text-red-500",
      warn: "text-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type StatProps = {
  text: string;
  value: string | number;
  secondaryValue?: string | number; // 👈 new
  secondaryVariant?: VariantProps<typeof valueVariants>["variant"];
  showCurrency?: boolean;
  variant?: VariantProps<typeof valueVariants>["variant"];
  className?: string;
  secondaryClass?: string;
  icon?: React.ReactNode;
};

const Stat = ({
  text,
  value,
  secondaryValue,
  showCurrency = true,
  variant,
  className,
  secondaryClass,
  icon,
}: StatProps) => {
  const format = (val: string | number) =>
    isNaN(Number(val)) ? val : formatNepaliAmount(Number(val));

  return (
    <div className="flex flex-col gap-y-1">
      <p className="text-xs text-foreground/50 font-medium">{text}</p>

      {/* Primary value */}
      <p
        className={`flex flex-row items-center gap-x-1 ${valueVariants({ variant })} ${className}`}
      >
        {showCurrency && BRAND.currency.symbol}
        {format(value)}

        {icon}
      </p>

      {/* Secondary (e.g. original price) */}
      {secondaryValue !== undefined && (
        <p
          className={`text-xs text-foreground/40 font-medium ${secondaryClass}`}
        >
          {showCurrency && BRAND.currency.symbol}
          {format(secondaryValue)}
        </p>
      )}
    </div>
  );
};

const Pricing = () => {
  const form = useFormContext<PricingSchemaType>();

  const { baseCostPrice, baseSellingPrice, discount } = form.watch();

  const finalPrice = discount
    ? baseSellingPrice * (1 - discount / 100)
    : baseSellingPrice;

  let profit = finalPrice - baseCostPrice;

  const profitMargin = (profit / baseSellingPrice) * 100;

  const hasDiscount = Number(discount) > 0;

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
                  type="number"
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
                  type="number"
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
                  type="number"
                  label="Discount %"
                  Icon={Percent}
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
        <div className="bg-accent border border-border rounded-xl px-6 py-5 space-y-4">
          <p className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />

            <span className="text-foreground/80 font-medium">
              Profit Analysis
            </span>
          </p>

          {/* Stats */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat text="Cost" value={baseCostPrice ?? 0.0} />

            <Stat
              text="Final Price"
              value={finalPrice}
              variant={finalPrice > 0 ? "special" : "default"}
              secondaryValue={hasDiscount ? baseSellingPrice : undefined}
              secondaryClass="line-through"
              className={`${finalPrice > 0 ? "font-bold!" : "font-medium!"}`}
            />

            <Stat
              text="Discount"
              value={`${hasDiscount ? discount : 0}%`}
              secondaryValue={
                hasDiscount
                  ? `${(discount! / 100) * baseSellingPrice}`
                  : undefined
              }
              variant={"warn"}
              showCurrency={false}
              icon={
                discount && Number(discount) > 0 ? (
                  <ArrowDownRight className="size-3" />
                ) : undefined
              }
            />

            <Stat
              text="Profit"
              value={finalPrice - baseCostPrice}
              variant={profit > 0 ? "success" : "danger"}
              icon={
                profit === 0 ? undefined : profit > 0 ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )
              }
            />
          </div>

          {/* Profit Margin */}
          <div className="bg-background1 border border-border rounded-2xl space-y-2 px-4 py-3">
            <div className="flex flex-row justify-between">
              <p className="text-xs text-foreground/60 font-medium">
                Profit margin
              </p>

              <p
                className={`text-xs font-medium ${profit === 0 ? "text-foreground" : profit < 0 ? "text-destructive" : "text-success"}`}
              >
                {isNaN(Number(profitMargin)) ? 0 : profitMargin}%
              </p>
            </div>

            <div className="w-full h-2 bg-accent rounded-inherit overflow-hidden">
              {profit > 0 && (
                <div
                  className="h-full bg-linear-gradient rounded-inherit"
                  style={{
                    width: `${Math.max(0, Math.min(100, profitMargin))}%`,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Pricing;
