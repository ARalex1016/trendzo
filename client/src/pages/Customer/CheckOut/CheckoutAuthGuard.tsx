import { useNavigate } from "react-router-dom";

// Components
import { Button } from "@/components/ui/button";

const CheckoutAuthGuard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background1 border border-border lg:col-span-2 w-full! h-fit gap-0 flex flex-col items-ceapnter rounded-xl p-side-spacing">
      {/* Icon */}
      <div className="text-red-500 text-4xl mb-3">⚠️</div>

      {/* Title */}
      <h2 className="text-xl text-foreground/80 font-semibold mb-2">
        Login Required
      </h2>

      {/* Message */}
      <p className="text-foreground/50 text-center mb-4">
        You need to log in first before accessing the checkout page.
      </p>

      {/* Button */}
      <Button onClick={() => navigate("/login")} className="px-10">
        Go to Login
      </Button>
    </div>
  );
};

export default CheckoutAuthGuard;
