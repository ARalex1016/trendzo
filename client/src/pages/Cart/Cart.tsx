import { useNavigate } from "react-router-dom";

// Components
import { Title, BaseText } from "@/components/Text";
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
    <section className="w-full min-h-svh flex flex-col gap-x-8 px-side-spacing py-4 relative pb-20">
      <Title text="Shopping Cart" />

      <BaseText>{cart?.items.length} items in your cart</BaseText>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
        <CartList />

        <OrderSummary oncheckOut={handleCheckout} />
      </div>

      <MobileCheckoutBar
        total={cart.totals.total}
        discount={cart.totals.discount}
        oncheckOut={handleCheckout}
      />
    </section>
  );
};

export default Cart;
