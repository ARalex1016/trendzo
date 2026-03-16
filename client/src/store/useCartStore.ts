import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
import type { ICart, ICartItem, CartTotals } from "@/types/cart.type";

interface CartStore {
  cart: ICart;

  addToCart: (item: ICartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

export const calculateTotals = (items: ICartItem[]): CartTotals => {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const discount = 0;
  const deliveryCharge = 0;
  const tax = 0;

  const total = subtotal - discount + deliveryCharge + tax;

  return {
    itemsCount,
    subtotal,
    discount,
    deliveryCharge,
    tax,
    total,
  };
};

const emptyCart: ICart = {
  items: [], // no items in the cart
  coupon: undefined, // no coupon applied

  totals: calculateTotals([]),

  expiresAt: undefined, // no expiration set yet
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      // central cart updater
      const updateCartItems = (
        updater: (items: ICartItem[]) => ICartItem[],
      ) => {
        const cart = get().cart;

        const currentItems = cart?.items ?? [];

        const updatedItems = updater(currentItems);

        const totals = calculateTotals(updatedItems);

        set({
          cart: {
            items: updatedItems,
            totals,
            createdAt: cart?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      };

      return {
        cart: emptyCart,

        addToCart: (newItem) =>
          updateCartItems((items) => {
            const index = items.findIndex(
              (item) =>
                item.product === newItem.product &&
                item.variantId === newItem.variantId &&
                item.color._id === newItem.color._id &&
                item.size._id === newItem.size._id,
            );

            if (index !== -1) {
              return items.map((item, i) =>
                i === index
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item,
              );
            }

            return [...items, newItem];
          }),

        removeFromCart: (index) =>
          updateCartItems((items) => items.filter((_, i) => i !== index)),

        updateQuantity: (index, quantity) =>
          updateCartItems((items) =>
            items.map((item, i) =>
              i === index ? { ...item, quantity } : item,
            ),
          ),

        clearCart: () =>
          set({
            cart: emptyCart,
          }),
      };
    },
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
