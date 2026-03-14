// Components
import CouponCode from "./CouponCode";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Store
import useCartStore from "@/store/useCartStore";

interface SummaryItemProps {
  title: string;
  value: string | number;
}

interface OrderSummaryProps {
  oncheckOut: () => void;
}

const SummaryItem = ({ title, value }: SummaryItemProps) => {
  if (!value) return;

  return (
    <div className="flex flex-row justify-between">
      <p className="text-foreground/70">{title}</p>

      <p
        className={`font-medium ${value.toString().toLowerCase() === "free" && "text-green-400"}`}
      >
        {value}
      </p>
    </div>
  );
};

const SummaryTotal = ({ title, value }: SummaryItemProps) => {
  return (
    <div className="flex flex-row justify-between">
      <p className="text-foreground font-medium">{title}</p>

      <p className="text-xl text-primary font-bold">{value}</p>
    </div>
  );
};

const OrderSummary = ({ oncheckOut }: OrderSummaryProps) => {
  const { cart } = useCartStore();

  return (
    <div className="w-full h-fit col-span-1 bg-background1 border rounded-xl flex flex-col gap-y-3 p-6 sticky top-menu-height">
      <p className="font-medium">Order Summary</p>

      <CouponCode />

      <Separator />

      <SummaryItem title="Subtotal" value={`Rs ${cart?.totals.subtotal}`} />

      <SummaryItem
        title="Delivery"
        value={`${cart?.totals.deliveryCharge === 0 ? "FREE" : "Rs " + cart?.totals.deliveryCharge}`}
      />

      <SummaryItem title="Tax" value={cart?.totals.tax!} />

      <Separator />

      <SummaryTotal title="Total" value={`Rs ${cart?.totals.total}`} />

      <Button onClick={oncheckOut} className="py-6!">
        Proceed to Checkout
      </Button>

      {/* Payment Methods */}
      {/* <div>
        <p className="text-sm text-foreground/60">Accepted Payment Methods</p>
      </div> */}
    </div>
  );
};

export default OrderSummary;
