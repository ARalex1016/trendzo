// Components
import { Button } from "@/components/ui/button";

interface MobileCheckoutBarProps {
  total: number;
  discount?: number;
  oncheckOut: () => void;
}

const MobileCheckoutBar = ({
  total,
  discount,
  oncheckOut,
}: MobileCheckoutBarProps) => {
  return (
    <div className="w-full bg-background1 border-t border-t-border flex sm:hidden flex-row justify-between fixed bottom-0 left-0 px-side-spacing py-3">
      <div>
        <p className="text-xs text-foreground/70">Total Amount</p>

        <div className="flex flex-row items-center gap-x-2">
          <p className="text-xl text-foreground font-bold">Rs. {total}</p>

          {discount && (
            <p className="text-sm text-primary font-bold line-through">
              Rs. {total}
            </p>
          )}
        </div>
      </div>

      <Button onClick={oncheckOut}>Checkout</Button>
    </div>
  );
};

export default MobileCheckoutBar;
