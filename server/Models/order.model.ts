import mongoose, { Schema, Document, Types, Model } from "mongoose";

export type OrderType = "online" | "in_store";

export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "completed" | "failed";

export type PaymentMethod = "bank" | "esewa" | "khalti" | "cod" | "cash";

export interface IOrder extends Document {
  user?: Types.ObjectId;
  items: Types.ObjectId[];

  orderType: OrderType;
  cashier?: Types.ObjectId; // Operator/Admin

  totalAmount: number;
  totalCost: number; // SUM of costPrice * qty
  totalProfit: number;

  discount?: number;
  deliveryCharge: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  status: OrderStatus;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  coupon?: Types.ObjectId;
  orderNote?: string;
  deliveredAt?: Date;
  cancellationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    orderType: {
      type: String,
      enum: ["online", "in_store"],
      required: true,
    },
    cashier: { type: Schema.Types.ObjectId, ref: "User" },
    totalAmount: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    totalProfit: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["bank", "esewa", "khalti", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "placed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
    },
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: String,
      postalCode: String,
      country: String,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    orderNote: { type: String, required: false },
    deliveredAt: { type: Date },
    cancellationDate: { type: Date },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
