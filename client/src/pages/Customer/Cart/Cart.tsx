import { useNavigate } from "react-router-dom";

// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import MobileCheckoutBar from "./MobileCheckoutBar";
import EmptyCart from "./EmptyCart";

// Store
import useCartStore from "@/store/useCartStore";

const Cart = () => {
  const navigate = useNavigate();

  const { cart } = useCartStore();

  if (!cart || cart?.items?.length === 0) {
    return <EmptyCart />;
  }

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <PageShell className="min-h-svh relative">
      <TitleTextContainer title="Shopping Cart">
        {cart?.items.length} items in your cart
      </TitleTextContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4">
        <CartList />

        <OrderSummary oncheckOut={handleCheckout} />
      </div>

      <MobileCheckoutBar
        total={cart.totals.total}
        discount={cart.totals.discount}
        oncheckOut={handleCheckout}
      />
    </PageShell>
  );
};

export default Cart;
