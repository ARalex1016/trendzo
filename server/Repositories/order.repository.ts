import { Types } from "mongoose";

// Models
import Order from "../Models/order.model.ts";

export const OrderRepository = {
  async countUserOrders(userId: Types.ObjectId, session: any) {
    return Order.countDocuments({ user: userId }).session(session);
  },
};
