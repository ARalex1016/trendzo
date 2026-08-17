import { Types, type ClientSession } from "mongoose";

// Models
import OrderItem from "../Models/order-item.model.ts";

// Types
import type { IImage } from "../Models/product.model.ts";

export const OrderItemRepository = {
  create(
    data: {
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

      costPrice: number;
      sellingPrice: number;

      totalCost: number;
      totalPrice: number;
      profit: number;
    },
    session?: ClientSession,
  ) {
    const item = new OrderItem(data);
    if (session) item.$session(session);

    return item.save();
  },

  findManyByIds(ids: Types.ObjectId[], session?: ClientSession) {
    return OrderItem.find({ _id: { $in: ids } }).session(session ?? null);
  },
};
