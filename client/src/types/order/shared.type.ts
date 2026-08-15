export type OrderType = "online" | "in_store";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "partial" | "completed" | "failed";

export type PaymentMethod = "bank" | "esewa" | "khalti";

export type PaymentMethodOnline = PaymentMethod | "cod";

export type PaymentMethodInStore = PaymentMethod | "cash";

export type PaymentCollectionType = "delivery_only" | "full" | "none";

export interface DeliveryAddress {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}
