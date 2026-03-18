import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
import type {
  ICart,
  ICartItem,
  CartTotals,
  AppliedCoupon,
} from "@/types/cart.type";
import type { ICoupon } from "@/types/coupon.type";

interface CartStore {
  cart: ICart;

  addToCart: (item: ICartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;

  applyCoupon: (coupon: ICoupon) => void;
  removeCoupon: () => void;
}

const calculateSubtotal = (items: ICartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateCouponDiscount = (
  subtotal: number,
  coupon?: AppliedCoupon | ICoupon,
): number => {
  if (!coupon) return 0;

  if (subtotal < coupon.minPurchase) return 0;

  let discount = 0;

  if (coupon.type === "percentage") {
    discount = (subtotal * coupon.value) / 100;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else if (coupon.type === "fixed") {
    discount = coupon.value;
  }

  // safety: discount should never exceed subtotal
  return Math.min(discount, subtotal);
};

export const calculateTotals = (
  items: ICartItem[],
  coupon?: AppliedCoupon,
): CartTotals => {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateSubtotal(items);

  const discount = calculateCouponDiscount(subtotal, coupon);
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
  items: [],
  coupon: undefined,
  totals: calculateTotals([]),
  expiresAt: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const updateCartItems = (
        updater: (items: ICartItem[]) => ICartItem[],
      ) => {
        const cart = get().cart;
        const currentItems = cart?.items ?? [];
        const updatedItems = updater(currentItems);

        let coupon = cart?.coupon;

        // if coupon exists but cart no longer qualifies, remove it
        if (coupon) {
          const subtotal = calculateSubtotal(updatedItems);
          if (subtotal < coupon.minPurchase) {
            coupon = undefined;
          } else {
            const updatedDiscount = calculateCouponDiscount(subtotal, coupon);
            coupon = {
              ...coupon,
              discountAmount: updatedDiscount,
            };
          }
        }

        const totals = calculateTotals(updatedItems, coupon);

        set({
          cart: {
            ...cart,
            items: updatedItems,
            coupon,
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
            items
              .map((item, i) =>
                i === index
                  ? { ...item, quantity: Math.max(1, quantity) }
                  : item,
              )
              .filter((item) => item.quantity > 0),
          ),

        clearCart: () =>
          set({
            cart: {
              ...emptyCart,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }),

        applyCoupon: (coupon) => {
          const cart = get().cart;
          const items = cart.items ?? [];
          const subtotal = calculateSubtotal(items);

          if (items.length === 0) {
            return;
          }

          if (subtotal < coupon.minPurchase) {
            return;
          }

          const discountAmount = calculateCouponDiscount(subtotal, coupon);

          const appliedCoupon: AppliedCoupon = {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minPurchase: coupon.minPurchase,
            maxDiscount: coupon.maxDiscount,
            discountAmount,
          };

          const totals = calculateTotals(items, appliedCoupon);

          set({
            cart: {
              ...cart,
              coupon: appliedCoupon,
              totals,
              updatedAt: new Date().toISOString(),
            },
          });
        },

        removeCoupon: () => {
          const cart = get().cart;
          const totals = calculateTotals(cart.items);

          set({
            cart: {
              ...cart,
              coupon: undefined,
              totals,
              updatedAt: new Date().toISOString(),
            },
          });
        },
      };
    },
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
