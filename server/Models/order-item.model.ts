import mongoose, { Schema, Document, Types, Model } from "mongoose";

import type { IImage } from "./product.model.ts";

export interface IOrderItem extends Document {
  product: Types.ObjectId;
  productName: string;
  productImage: IImage;

  color: {
    id: Types.ObjectId;
    name: string;
    hexCode: string;
  };
  size: {
    id: Types.ObjectId;
    name: string;
  };

  quantity: number;

  costPrice: number; // snapshot at purchase time
  sellingPrice: number; // snapshot at purchase time

  totalCost: number;
  totalPrice: number;
  profit: number;

  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: imageSchema,
      required: true,
    },
    color: {
      id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
      name: { type: String, required: true },
      hexCode: { type: String, required: true },
    },
    size: {
      id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
      name: { type: String, required: true },
    },
    quantity: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },

    totalPrice: { type: Number, required: true },
    profit: { type: Number, required: true },
  },
  { timestamps: true },
);

const OrderItem: Model<IOrderItem> = mongoose.model<IOrderItem>(
  "OrderItem",
  orderItemSchema,
);
export default OrderItem;
