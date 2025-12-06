import mongoose, { Schema, Document, Types, Model } from "mongoose";

export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: Types.ObjectId[];
  totalAmount: number;
  discount?: number;
  deliveryCharge: number;
  paymentMethod: "bank" | "esewa" | "khalti" | "cod";
  status: OrderStatus;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  orderNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["bank", "esewa", "khalti", "cod"],
      required: true,
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
    orderNote: String,
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
