import { useState } from "react";

// Components
import { Button } from "@/components/ui/button";

// Icons
import { Tag } from "lucide-react";

// Types
import type { ICode } from "@/types/coupon.type";

// Store
import useCouponStore from "@/store/useCouponStore";

const CouponCode = () => {
  const { validateCoupon } = useCouponStore();

  const [code, setCode] = useState<ICode>("");
  const [validating, setValidating] = useState<boolean>(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleValidateCoupon = async () => {
    setValidating(true);

    try {
      let res = await validateCoupon(code);
      console.log(res);
    } catch (error) {
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="my-2">
      <p className="text-sm">Have a coupon code?</p>

      <div className="w-full flex flex-row gap-x-3 mt-2">
        {/* Input Field with Tag icon */}
        <div className="w-full bg-background border rounded-md flex  flex-row justify-center items-center focus-within:border-blue-500">
          <Tag size={16} className="ml-3 mr-2 text-foreground/60" />

          <input
            id="code"
            name="code"
            type="text"
            placeholder="Enter Code"
            value={code}
            onChange={handleCodeChange}
            className="w-full bg-transparent border-none focus:outline-none pr-4"
          />
        </div>

        <Button
          disabled={validating}
          onClick={handleValidateCoupon}
          className="h-full"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default CouponCode;
