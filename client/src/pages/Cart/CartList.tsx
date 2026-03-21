// Components
import CartItem from "./CartItem";

// Store
import useCartStore from "@/store/useCartStore";

const CartList = () => {
  const { cart } = useCartStore();

  return (
    <div className="lg:col-span-2 flex flex-col gap-y-2 xs:gap-y-4">
      {cart?.items?.length > 0 &&
        cart.items.map((item, i) => (
          <CartItem key={`${item.product}-${i}`} item={item} index={i} />
        ))}
    </div>
  );
};

export default CartList;
