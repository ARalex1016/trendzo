// Types
import type { IColor } from "./color.type";
import type { ISize } from "./size.types";

export type CartColor = Pick<IColor, "_id" | "name" | "hexCode">;
export type CartSize = Pick<ISize, "_id" | "name">;

export interface AppliedCoupon {
  code: string;

  type: "percentage" | "fixed";
  value: number;

  minPurchase: number;
  maxDiscount?: number;

  discountAmount: number;
}

export interface ICartItem {
  product: string; // productId

  productName: string; // snapshot
  slug: string;

  productImage: string;

  sku?: string;
  variantId?: string;

  price: number;

  quantity: number;

  color: CartColor;
  size: CartSize;

  subtotal: number; // price * quantity
}

export interface CartTotals {
  itemsCount: number;
  subtotal: number;

  discount?: number;

  deliveryCharge?: number;

  tax?: number;

  total: number;
}

export interface ICart {
  items: ICartItem[];

  coupon?: AppliedCoupon;

  totals: CartTotals;

  expiresAt?: string;

  createdAt: string;
  updatedAt: string;
}
