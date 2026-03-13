// Components
import { Title, BaseText } from "@/components/Text";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import MobileCheckoutBar from "./MobileCheckoutBar";

// Store
import useCartStore from "@/store/useCartStore";

const Cart = () => {
  const { cart } = useCartStore();

  if (!cart || cart?.items?.length === 0) {
    return <p>Your cart is empty</p>;
  }

  const handleCheckout = () => {};

  return (
    <section className="w-full m-auto min-h-svh flex flex-col gap-x-8 px-side-spacing py-4 relative pb-20">
      <Title text="Shopping Cart" />

      <BaseText>{cart?.items.length} items in your cart</BaseText>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-6">
        <CartList />

        <OrderSummary oncheckOut={handleCheckout} />
      </div>

      <MobileCheckoutBar
        total={cart.totals.total}
        oncheckOut={handleCheckout}
      />
    </section>
  );
};

export default Cart;
