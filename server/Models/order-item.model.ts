import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IOrderItem extends Document {
  product: Types.ObjectId;
  color: string;
  size: string;
  quantity: number;

  costPrice: number; // snapshot at purchase time
  sellingPrice: number; // snapshot at purchase time

  totalCost: number;
  totalPrice: number;
  profit: number;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    profit: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderItem: Model<IOrderItem> = mongoose.model<IOrderItem>(
  "OrderItem",
  orderItemSchema
);
export default OrderItem;
