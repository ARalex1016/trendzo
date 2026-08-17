import type {
  PaymentStatus,
  OrderStatus,
  OrderType,
  PaymentMethodOnline,
  PaymentMethodInStore,
  PaymentCollectionType,
  DeliveryAddress,
} from "./shared.type";
import type { IImage } from "../product/product_shared";

export interface IOrderItemRes {
  product: string;
  productName: string;
  productImage: IImage;

  color: {
    id: string;
    name: string;
    hexCode: string;
  };
  size: {
    id: string;
    name: string;
  };

  quantity: number;

  costPrice?: number; // snapshot at purchase time
  sellingPrice: number; // snapshot at purchase time

  totalCost?: number;
  totalPrice: number;
  profit?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderRes {
  _id: string;
  orderNumber: string;

  user?: string;
  cashier?: string;

  orderType: OrderType;

  items: IOrderItemRes[];

  // Financial snapshot
  subtotal: number; // Sum of all products prices (with discount)
  discount?: number;
  orderAmount: number; // Subtotal - Discount
  deliveryCharge?: number;
  totalAmount: number; // OrderAmount + deliveryCharge

  // Cost & profit
  totalCost?: number;
  totalProfit?: number;

  // Payment
  paymentMethod: PaymentMethodOnline | PaymentMethodInStore;
  paymentCollectionType: PaymentCollectionType;
  paymentStatus: PaymentStatus;

  confirmationPaymentDue: number;
  prepaidAmount: number;
  amountDueOnDelivery: number;

  // Coupon
  coupon?: string;

  // Order
  status: OrderStatus;

  deliveryAddress?: DeliveryAddress;

  orderNote?: string;

  // Dates
  deliveredAt?: string;
  shippedAt?: string;
  cancellationDate?: string;

  cancelledBy?: string;
  cancellationReason?: string;

  createdAt: string;
  updatedAt: string;
}
