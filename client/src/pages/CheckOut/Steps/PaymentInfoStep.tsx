import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Title } from "@/components/Text";

// Types
import { type PaymentStepSchemaType } from "@/validations/checkout.validator";
import type { PaymentMethodOnline } from "@/types/order.type";

// Icons
import {
  type LucideIcon,
  CreditCard,
  Wallet,
  Banknote,
  FileText,
  Check,
} from "lucide-react";

interface PaymentMethodProps {
  name: string;
  method: PaymentMethodOnline;
  detail: string;
  icon: LucideIcon;
}

const paymentMethods: PaymentMethodProps[] = [
  {
    name: "Bank",
    method: "bank",
    detail: "Pay via online banking or bank transfer",
    icon: CreditCard,
  },
  {
    name: "eSewa",
    method: "esewa",
    detail: "Pay using your eSewa wallet",
    icon: Wallet,
  },
  {
    name: "Khalti",
    method: "khalti",
    detail: "Pay using your Khalti wallet",
    icon: Wallet,
  },
  {
    name: "Cash on Delivery (COD)",
    method: "cod",
    detail: "Pay when you receive the product",
    icon: Banknote,
  },
];

const PaymentInfoStep = () => {
  const form = useFormContext<PaymentStepSchemaType>();

  const selectedPaymentMethod = form.watch("paymentMethod");

  const handleSelectPaymentMethod = (paymentMethods: PaymentMethodOnline) => {
    form.setValue("paymentMethod", paymentMethods, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-6 py-5">
        <div className="flex flex-col gap-y-3">
          {paymentMethods.map((payment_method) => {
            const Icon = payment_method.icon;
            const isSelected = selectedPaymentMethod === payment_method.method;

            return (
              <label
                key={payment_method.method}
                htmlFor={payment_method.method}
                className={`bg-accent rounded-md border flex flex-row items-center gap-x-4 p-4 relative ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-accent"
                }`}
              >
                <input
                  id={payment_method.method}
                  type="radio"
                  checked={isSelected}
                  onChange={() =>
                    handleSelectPaymentMethod(payment_method.method)
                  }
                  className="sr-only"
                />

                {/* Check Icon */}
                {isSelected && (
                  <div className="size-5 flex shrink-0 items-center justify-center rounded-full border transition absolute top-4 right-3 border-primary bg-primary text-primary-foreground">
                    <Check size={"15px"} />
                  </div>
                )}

                <div className="flex justify-center items-center bg-background1 rounded-inherit p-2">
                  <Icon />
                </div>

                <div>
                  <p className="text-lg font-medium">{payment_method.name}</p>

                  <p className="text-sm text-foreground/80">
                    {payment_method.detail}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Order Notes Section */}
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row items-center gap-x-2">
            <div className="size-8 bg-primary rounded-full flex justify-center items-center">
              <FileText size={18} className="" />
            </div>

            <Title text="Order Notes (Optional)" />
          </div>

          {/* Order Note Input */}
          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <textarea
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Any special instructions for your order..."
                  className="w-full min-h-30 max-h-42 bg-accent rounded-md p-3"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
};

export default PaymentInfoStep;
