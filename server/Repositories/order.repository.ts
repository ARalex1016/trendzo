import { Types, type ClientSession } from "mongoose";

// Models
import Order, { type IOrder } from "./../Models/order.model.ts";

// Utils
import AppError from "../Utils/AppError.ts";

export const OrderRepository = {
  create(data: any, session?: any) {
    const order = new Order(data);
    if (session) order.$session(session);
    return order.save();
  },

  findById(orderId: Types.ObjectId, session?: any) {
    return Order.findById(orderId)
      .populate({
        path: "items",
        populate: { path: "product", select: "name slug variants" },
      })
      .session(session ?? null);
  },

  findUserOrders(
    userId: Types.ObjectId,
    filter: any,
    pagination: { skip: number; limit: number },
    session?: any
  ) {
    return Order.find({ user: userId, ...filter })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate({
        path: "items",
        populate: { path: "product", select: "name slug variants" },
      })
      .session(session ?? null);
  },

  findByIdWithItems(id: Types.ObjectId, session?: any) {
    return Order.findById(id)
      .populate({
        path: "items",
        populate: { path: "product", select: "name slug variants" },
      })
      .session(session ?? null);
  },

  updateById(orderId: Types.ObjectId, updates: any, session?: any) {
    return Order.findByIdAndUpdate(orderId, updates, {
      new: true,
      session,
    });
  },

  updateStatus(
    orderId: Types.ObjectId,
    status: string,
    extra: any = {},
    session?: any
  ) {
    return Order.findByIdAndUpdate(
      orderId,
      { status, ...extra },
      { new: true, session }
    );
  },

  async markDelivered(
    orderId: Types.ObjectId,
    deliveredAt: Date,
    session?: ClientSession
  ): Promise<IOrder> {
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: { $in: ["placed", "processing", "shipped"] }, // guard
      },
      {
        status: "delivered",
        deliveredAt,
      },
      {
        new: true,
        session: session ?? null,
      }
    );

    if (!order) {
      throw new AppError(
        "Order not found or cannot be marked as delivered",
        400
      );
    }

    return order;
  },

  findByUser(
    userId: Types.ObjectId,
    filter: any,
    pagination: { skip: number; limit: number }
  ) {
    return Order.find({ user: userId, ...filter })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate({
        path: "items",
        populate: { path: "product", select: "name slug variants" },
      });
  },

  findAll(filter: any, pagination: any, session?: any) {
    return Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate({
        path: "items",
        populate: { path: "product", select: "name slug variants" },
      })
      .session(session ?? null);
  },

  // COUNT
  count(filter: any = {}, session?: any) {
    return Order.countDocuments(filter).session(session ?? null);
  },

  countUserOrders(userId: Types.ObjectId, filter: any = {}, session?: any) {
    return Order.countDocuments({ user: userId, ...filter }).session(
      session ?? null
    );
  },
};
