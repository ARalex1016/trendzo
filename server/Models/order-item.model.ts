import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IOrderItem extends Document {
  product: Types.ObjectId;
  color: string;
  size: string;
  quantity: number;
  price: number;
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
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderItem: Model<IOrderItem> = mongoose.model<IOrderItem>(
  "OrderItem",
  orderItemSchema
);
export default OrderItem;
