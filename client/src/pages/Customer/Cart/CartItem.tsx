import type React from "react";

// Components
import { Button } from "@/components/ui/button";

// Types
import type { ICartItem } from "@/types/cart.type";

// Icons
import { Trash2 } from "lucide-react";

// Store
import useCartStore from "@/store/useCartStore";

interface CartItemProps {
  item: ICartItem;
  index: number;
}

const ActionButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      {...props}
      className={`size-8 text-lg flex justify-center items-center border border-border rounded-full hover:border-primary hover:shadow-sm hover:shadow-primary/60 ${className}`}
    >
      {children}
    </button>
  );
};

const CartItem = ({ item, index }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="w-full bg-background1 border flex flex-row gap-x-4 sm:gap-x-6 rounded-xl hover:border-primary hover:shadow-sm hover:shadow-primary/60 p-3 xs:p-4 sm:p-6">
      {/* Image */}
      <img
        src={item.productImage}
        alt={`${item.productName}-img`}
        className="size-20 xs:size-24 sm:size-28 rounded-inherit"
      />

      <div className="w-full flex flex-col">
        {/* Item Details */}
        <div className="flex flex-row justify-between">
          {/* Name, Size & Color */}
          <div className="flex flex-col gap-y-2">
            <p className="text-sm xs:text-[15px] sm:text-base font-medium line-clamp-1">
              {item.productName}
            </p>

            {/* Size and Color */}
            <div className="flex flex-row gap-x-4">
              <p className="text-[10px] xs:text-xs sm:text-sm text-foreground/60 bg-background rounded-md border border-border px-2 py-0.5">
                Size: {item.size.name}
              </p>

              <p className="text-[10px] xs:text-xs sm:text-sm text-foreground/60 bg-background rounded-md border border-border px-2 py-0.5">
                Color: {item.color.name}
              </p>
            </div>
          </div>

          {/* Price */}
          <p className="text-sm xs:text-[15px] sm:text-base font-medium">
            Rs {item.price}
          </p>
        </div>

        {/* Quantity and Action Buttons */}
        <div className="flex flex-row justify-between mt-auto">
          {/* Quantity */}
          <div className="flex flex-row justify-center items-center gap-x-4">
            <ActionButton
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(index, item.quantity - 1)}
              className="disabled:cursor-not-allowed text-sm xs:text-[15px] sm:text-base"
            >
              −
            </ActionButton>

            <p className="w-[3ch] text-sm xs:text-[15px] sm:text-base text-center">
              {item.quantity}
            </p>

            <ActionButton
              onClick={() => updateQuantity(index, item.quantity + 1)}
              className="text-sm xs:text-[15px] sm:text-base"
            >
              +
            </ActionButton>
          </div>

          {/* Remove Button */}
          <Button
            onClick={() => removeFromCart(index)}
            className="size-7.5! xs:size-8! sm:size-9!"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
