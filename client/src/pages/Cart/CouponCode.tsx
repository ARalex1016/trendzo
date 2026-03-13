// Components
import { Button } from "@/components/ui/button";

// Icons
import { Tag } from "lucide-react";

const CouponCode = () => {
  return (
    <div className="my-2">
      <p className="text-sm">Have a coupon code?</p>

      <div className="w-full flex flex-row gap-x-2 mt-2">
        {/* Input Field with Tag icon */}
        <div className="w-full bg-background border rounded-md flex  flex-row justify-center items-center focus-within:border-blue-500">
          <Tag size={16} className="m-2 text-foreground/60" />

          <input
            type="text"
            placeholder="Enter Code"
            className="w-full bg-transparent border-none focus:outline-none pr-4"
          />
        </div>

        <Button className="h-full">Apply</Button>
      </div>
    </div>
  );
};

export default CouponCode;
