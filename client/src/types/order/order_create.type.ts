import type {
  PaymentStatus,
  OrderStatus,
  DeliveryAddress,
  PaymentMethodOnline,
  PaymentMethod,
} from "./shared.type";

export interface OrderItem {
  product: string;
  color: string;
  size: string;
  quantity: number;
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
