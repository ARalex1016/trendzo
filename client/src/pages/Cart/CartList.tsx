// Components
import CartItem from "./CartItem";

// Store
import useCartStore from "@/store/useCartStore";

const CartList = () => {
  const { cart } = useCartStore();

  return (
    <div className="col-span-2 flex flex-col gap-y-4">
      {cart?.items.map((item, i) => {
        return <CartItem key={item.product} item={item} index={i} />;
      })}
    </div>
  );
};

export default CartList;
