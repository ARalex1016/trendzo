import { create } from "zustand";
import { persist } from "zustand/middleware";

// Utils
import { calculateTotals } from "@/utils/NumberManager";

// Types
import type { ICart, ICartItem } from "@/types/cart.type";

interface CartStore {
  cart: ICart | null;

  addToCart: (item: ICartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

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
        cart: null,

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
            cart: null,
          }),
      };
    },
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
