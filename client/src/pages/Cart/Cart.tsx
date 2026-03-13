// Components
import { Title, BaseText } from "@/components/Text";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";

// Store
import useCartStore from "@/store/useCartStore";

const Cart = () => {
  const { cart } = useCartStore();

  if (!cart || cart?.items?.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <section className="w-full m-auto min-h-svh flex flex-col gap-x-8 px-side-spacing py-4 relative">
      <Title text="Shopping Cart" />

      <BaseText>{cart?.items.length} items in your cart</BaseText>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-6">
        <CartList />

        <OrderSummary />
      </div>
    </section>
  );
};

export default Cart;
