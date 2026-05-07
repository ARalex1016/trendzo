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
