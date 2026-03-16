import { useNavigate, useLocation } from "react-router-dom";

// Components
import { Button } from "./ui/button";
// import { Badge } from "@/components/ui/badge";

// Store
// import useCartStore from "@/store/useCartStore";

// Icons
import { ShoppingCart } from "lucide-react";

export const CartButton = () => {
  // const { cart } = useCartStore();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate("/cart")}
        className={`bg-transparent! border-transparent! hover:bg-accent/80! ${location.pathname === "/cart" && "bg-accent/80! shadow shadow-primary"}`}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>

      {/* {cart && ( */}
      {/* <Badge className="absolute -top-2 -right-2 size-5.5"> */}
      {/* Items Total Count */}
      {/* {cart?.totals.itemsCount > 9 ? "+9" : cart?.totals.itemsCount} */}

      {/* Items Count */}
      {/* {cart?.items.length > 9 ? "+9" : cart?.items.length} */}
      {/* </Badge> */}
      {/* )} */}
    </div>
  );
};
