export type OrderType = "online" | "in_store";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "completed" | "failed";

export type PaymentMethodOnline = "bank" | "esewa" | "khalti" | "cod";

export type PaymentMethod = "bank" | "esewa" | "khalti" | "cash";

export interface DeliveryAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItem {
  product: string;
  color: string;
  size: string;
  quantity: number;
}

interface BaseOrder {
  orderNumber?: string;
  _id?: string;
  items: OrderItem[];
  totalAmount?: number;
  totalCost?: number;
  totalProfit?: number;
  discount?: number;
  deliveryCharge?: number;
  paymentStatus?: PaymentStatus;
  status?: OrderStatus;
  couponCode?: string;
  orderNote?: string;
  createdAt?: string;
  updatedAt?: string;
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

export type IOrder = OnlineOrder | StoreOrder;
