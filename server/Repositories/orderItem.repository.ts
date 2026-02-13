import { Types, type ClientSession } from "mongoose";

// Models
import OrderItem from "../Models/order-item.model.ts";

export const OrderItemRepository = {
  create(
    data: {
      product: Types.ObjectId;
      color: string;
      size: string;
      quantity: number;
      costPrice: number;
      sellingPrice: number;
      totalCost: number;
      totalPrice: number;
      profit: number;
    },
    session?: ClientSession
  ) {
    const item = new OrderItem(data);
    if (session) item.$session(session);
    return item.save();
  },

  findManyByIds(ids: any[], session?: any) {
    return OrderItem.find({ _id: { $in: ids } }).session(session ?? null);
  },
};
