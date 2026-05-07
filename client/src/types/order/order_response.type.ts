import type {
  PaymentStatus,
  OrderStatus,
  OrderType,
  PaymentMethodOnline,
  PaymentMethod,
  DeliveryAddress,
} from "./shared.type";

export interface IOrderItemRes {
  product: string;
  productName: string;
  productImage: string;

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
  orderNumber: string;
  _id: string;
  items: IOrderItemRes[];
  totalAmount: number;
  totalCost?: number;
  totalProfit?: number;
  discount?: number;
  deliveryCharge?: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  couponCode?: string;
  orderNote?: string;
  paymentMethod: PaymentMethodOnline | PaymentMethod;
  orderType: OrderType;
  deliveryAddress?: DeliveryAddress;
  user?: string;
  cashier?: string;
  createdAt: string;
  updatedAt: string;
}
