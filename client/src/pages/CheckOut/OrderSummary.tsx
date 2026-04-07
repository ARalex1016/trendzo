// Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Store
import useCartStore from "@/store/useCartStore";

// Icons
import { ShoppingBag } from "lucide-react";

// Types
import type { ICartItem } from "@/types/cart.type";

interface SummaryItemProps {
  title: string;
  value: string | number;
  className?: React.ReactNode;
}

interface OrderSummaryProps {
  onCheckout: () => void;
  disabled?: boolean;
  className?: string;
}

const SummaryItem = ({ title, value, className }: SummaryItemProps) => {
  if (!value) return;

  return (
    <div className="flex flex-row justify-between">
      <p className="text-foreground/70">{title}</p>

      <p
        className={`font-medium ${value.toString().toLowerCase() === "free" && "text-green-400"} ${className}`}
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

const OrderItem = ({ item }: { item: ICartItem }) => {
  return (
    <div className="bg-accent rounded-lg flex flex-row gap-x-4 p-2 border hover:border-primary">
      <img
        src={item.productImage}
        alt={`${item.productName}-img`}
        className="size-16 aspect-square rounded-md"
      />

      <div className="w-full flex flex-col gap-y-1">
        <p className="text-sm font-medium">{item.productName}</p>

        <div className="w-full flex flex-row gap-x-2">
          <p className="text-xs text-foreground/60">
            Size: <span className="text-foreground/90">{item.size.name}</span>
          </p>

          <p className="text-xs text-foreground/60">
            Color: <span className="text-foreground/90">{item.color.name}</span>
          </p>
        </div>

        <div className="w-full flex flex-row gap-x-20">
          <p className="text-xs text-foreground/60">
            Qty: <span className="text-foreground/90">{item.quantity}</span>
          </p>

          <p className="text-primary font-medium">Rs.{item.price}</p>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = ({
  onCheckout,
  disabled,
  className,
}: OrderSummaryProps) => {
  const { cart } = useCartStore();

  return (
    <div
      className={`w-full h-fit col-span-1 bg-background1 border rounded-xl flex flex-col gap-y-3 p-6 sticky top-menu-height ${className}`}
    >
      <div className="flex flex-row items-center gap-x-2">
        <ShoppingBag className="text-primary" />
        <p className="text-lg font-medium">Order Summary</p>
      </div>

      <p className="text-sm text-foreground/70 mb-1">
        {cart.items.length} items in your cart
      </p>

      <div className="max-h-56 flex flex-col gap-y-4 overflow-y-auto no-scrollbar">
        {cart.items.map((item) => {
          return <OrderItem key={item.product} item={item} />;
        })}
      </div>

      <SummaryItem title="Subtotal" value={`Rs ${cart?.totals.subtotal}`} />

      {cart?.coupon && (
        <SummaryItem
          title="Discount"
          value={`- Rs ${cart?.coupon?.discountAmount}`}
          className="text-destructive!"
        />
      )}

      <SummaryItem
        title="Delivery"
        value={`${cart?.totals.deliveryCharge === 0 ? "FREE" : "Rs " + cart?.totals.deliveryCharge}`}
      />

      <SummaryItem title="Tax" value={cart?.totals.tax!} />

      <Separator />

      <SummaryTotal title="Total" value={`Rs ${cart?.totals.total}`} />

      <Button disabled={disabled} onClick={onCheckout} className="py-6!">
        Place order
      </Button>

      {/* Payment Methods */}
      {/* <div>
        <p className="text-sm text-foreground/60">Accepted Payment Methods</p>
      </div> */}
    </div>
  );
};

export default OrderSummary;
