import type {
  DeliveryAddress,
  PaymentMethodOnline,
  PaymentMethod,
} from "./shared.type";
import type { IImage } from "../product/product_shared";

export interface Color {
  hexCode: string;
  id: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  productName: string;
  productImage: IImage;
  color: Color;
  size: Size;
  quantity: number;
  price: number;
  discount?: number;
  totalPrice: number;
}

interface BaseOrder {
  items: OrderItem[];
  totalAmount?: number;
  discount?: number;
  deliveryCharge?: number;
  couponCode?: string;
  orderNote?: string;
}

export interface OnlineOrder extends BaseOrder {
  paymentMethod: PaymentMethodOnline;
  orderType?: "online";
  deliveryAddress: DeliveryAddress;
  user?: string;
}

export interface StoreOrder extends BaseOrder {
  paymentMethod: PaymentMethod;
  orderType: "in_store";
  cashier: string;
  deliveryAddress?: never;
}

export type CreateOrderPayload = OnlineOrder | StoreOrder;
