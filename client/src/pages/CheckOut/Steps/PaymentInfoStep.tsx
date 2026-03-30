// Components
import { Title } from "@/components/Text";

// Icons
import {
  type LucideIcon,
  CreditCard,
  Wallet,
  Banknote,
  FileText,
} from "lucide-react";

interface PaymentMethodProps {
  name: string;
  method: string;
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
    method: "eSewa",
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
  return (
    <div className="flex flex-col gap-y-6 py-5">
      <div className="flex flex-col gap-y-3">
        {paymentMethods.map((payment_method) => {
          const Icon = payment_method.icon;

          return (
            <div
              key={payment_method.method}
              className="bg-accent rounded-md border border-border flex flex-row items-center gap-x-4 p-4"
            >
              <div className="flex justify-center items-center bg-background1 rounded-inherit p-2">
                <Icon />
              </div>

              <div>
                <p className="text-lg font-medium">{payment_method.name}</p>

                <p className="text-sm text-foreground/80">
                  {payment_method.detail}
                </p>
              </div>
            </div>
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

        <textarea
          placeholder="Any special instructions for yur order..."
          className="w-full min-h-10 bg-accent rounded-md p-3"
        />
      </div>
    </div>
  );
};

export default PaymentInfoStep;
