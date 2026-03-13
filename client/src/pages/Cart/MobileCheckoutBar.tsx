// Components
import { Button } from "@/components/ui/button";

interface MobileCheckoutBarProps {
  total: number;
  oncheckOut: () => void;
}

const MobileCheckoutBar = ({ total, oncheckOut }: MobileCheckoutBarProps) => {
  return (
    <div className="w-full bg-background1 border-t border-t-border flex sm:hidden flex-row justify-between fixed bottom-0 left-0 px-side-spacing py-3">
      <div>
        <p className="text-xs text-foreground/70">Total Amount</p>

        <p className="text-xl text-primary font-bold">Rs. {total}</p>
      </div>

      <Button onClick={oncheckOut}>Checkout</Button>
    </div>
  );
};

export default MobileCheckoutBar;
