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

export type PaymentMethod = "bank" | "esewa" | "khalti" | "cod" | "cash";

export interface DeliveryAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface IOrder {
  _id: string;

  user?: string;

  items: string[];

  orderType: OrderType;

  cashier?: string;

  totalAmount: number;
  totalCost: number;
  totalProfit: number;

  discount?: number;
  deliveryCharge: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  status: OrderStatus;

  deliveryAddress: DeliveryAddress;

  coupon?: string;

  orderNote?: string;

  deliveredAt?: string;
  cancellationDate?: string;

  createdAt: string;
  updatedAt: string;
}
