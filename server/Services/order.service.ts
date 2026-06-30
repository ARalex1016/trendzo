import mongoose, { Types } from "mongoose";

// Service
import { PricingService } from "./pricing.service.ts";
import ProductService from "./product.service.ts";
import { CouponService } from "./../Services/coupon.service.ts";
import { DeliveryService } from "./../Services/delivery.service.ts";
import { ReferralService } from "../Services/referral.service.ts";

// Repository
import { OrderRepository } from "./../Repositories/order.repository.ts";
import { OrderItemRepository } from "../Repositories/orderItem.repository.ts";
import ProductRepository from "./../Repositories/product.repository.ts";
import { UserStatsService } from "./user-stats.service.ts";
import ColorRepository from "../Repositories/color.repository.ts";
import SizeRepository from "../Repositories/size.repository.ts";

// Types
import type { PaymentMethod, OrderStatus } from "../Models/order.model.ts";

// Utils
import AppError from "./../Utils/AppError.ts";

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"], // customer placed order → admin confirms or customer cancels
  confirmed: ["shipped", "cancelled"], // admin verified → courier ships or customer cancels
  shipped: ["delivered", "returned"], // courier picked up → delivered or returned
  delivered: ["returned", "refunded"], // delivered → returned or refunded
  cancelled: [], // final state
  returned: ["refunded"], // returned → refunded
  refunded: [], // final state
};

export const OrderService = {
  async placeOrder(input: {
    userId: string;
    cashierId?: string;

    items: {
      product: string;
      color: string;
      size: string;
      quantity: number;
    }[];

    paymentMethod: PaymentMethod;
    deliveryAddress: any;

    orderType: "online" | "in_store";

    couponCode?: string;
    orderNote?: string;
  }) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (!input.items || input.items.length === 0) {
        throw new AppError("Order must contain at least one item", 400);
      }

      let userId: Types.ObjectId | undefined;
      let cashierId: Types.ObjectId | undefined;

      if (input.orderType === "online" && input.userId) {
        userId = new Types.ObjectId(input.userId);
      }

      if (input.orderType === "in_store" && input.cashierId) {
        cashierId = new Types.ObjectId(input.cashierId);
      }

      // COUPON VALIDATION
      const coupon = input.couponCode
        ? await CouponService.validateAndConsumeCoupon(
            input.couponCode,
            input.orderType === "online" ? userId! : cashierId!,
            input.orderType,
            session,
          )
        : null;

      let totalSelling = 0;
      let totalCost = 0;

      const orderItemIds: Types.ObjectId[] = [];

      for (const item of input.items) {
        const product = await ProductRepository.findById(
          new Types.ObjectId(item.product),
        ).lean();

        if (!product) throw new AppError("Product not found", 404);

        if (!product.isActive)
          throw new AppError("Product is not available", 400);

        // FIND INVENTORY RECORD
        const inventory = product.inventory.find(
          (i: any) =>
            i.color.toString() === item.color &&
            i.size.toString() === item.size,
        );

        if (!inventory) throw new AppError("Product variant not found", 400);

        if (inventory.stock < item.quantity)
          throw new AppError("Insufficient stock", 400);

        // LOAD COLOR
        const color = await ColorRepository.findById(item.color);

        if (!color) throw new AppError("Color not found", 404);

        // LOAD SIZE
        const size = await SizeRepository.findById(item.size);

        if (!size) throw new AppError("Size not found", 404);

        // PRICE CALCULATION
        const sellingPrice = PricingService.calculateItemPrice(
          product.baseSellingPrice,
          product.discount,
        );

        const costPrice = product.baseCostPrice;

        const itemTotalCost = costPrice * item.quantity;
        const itemTotalPrice = sellingPrice * item.quantity;

        const profit = itemTotalPrice - itemTotalCost;

        // DECREMENT STOCK
        const res = await ProductRepository.decrementStock(
          product._id,
          new Types.ObjectId(item.color),
          new Types.ObjectId(item.size),
          item.quantity,
          session,
        );

        if (res.modifiedCount === 0) {
          throw new AppError("Stock update failed", 400);
        }

        // CREATE ORDER ITEM SNAPSHOT
        const orderItem = await OrderItemRepository.create(
          {
            product: product._id,

            productName: product.name,
            productImage: product.thumbnail,

            color: {
              id: color._id,
              name: color.name,
              hexCode: color.hexCode,
            },

            size: {
              id: size._id,
              name: size.name,
            },

            quantity: item.quantity,

            costPrice,
            sellingPrice,

            totalCost: itemTotalCost,
            totalPrice: itemTotalPrice,
            profit,
          },
          session,
        );

        totalSelling += itemTotalPrice;
        totalCost += itemTotalCost;

        orderItemIds.push(orderItem._id);
      }

      // DISCOUNT CALCULATION
      const discount = coupon
        ? Math.min(
            coupon.type === "percentage"
              ? (totalSelling * coupon.value) / 100
              : coupon.value,
            coupon.maxDiscount ?? Infinity,
          )
        : 0;

      // DELIVERY CHARGE
      const deliveryCharge =
        input.orderType === "in_store"
          ? 0
          : await DeliveryService.calculateCharge(input.deliveryAddress);

      const totalAmount = Math.max(0, totalSelling - discount + deliveryCharge);

      const totalProfit = totalAmount - totalCost - deliveryCharge;

      const orderData: any = {
        items: orderItemIds,

        orderType: input.orderType,

        totalAmount,
        totalCost,
        totalProfit,

        discount,
        deliveryCharge,

        paymentMethod: input.paymentMethod,
        orderNote: input.orderNote,
      };

      if (userId) orderData.user = userId;
      if (cashierId) orderData.cashier = cashierId;

      if (coupon) orderData.coupon = coupon._id;

      // ADDRESS
      if (input.orderType === "in_store") {
        orderData.deliveryAddress = {
          name: "In-Store",
          phone: "N/A",
          email: "N/A",
          address: "N/A",
          city: "N/A",
          postalCode: "N/A",
          country: "N/A",
        };
      } else {
        orderData.deliveryAddress = input.deliveryAddress;
      }

      // PAYMENT STATUS
      orderData.paymentStatus =
        input.orderType === "online" ? "pending" : "completed";

      const orderNumber = await OrderRepository.getNextOrderNumber();

      const order = await OrderRepository.create(
        { ...orderData, orderNumber },
        session,
      );

      // REFERRAL SYSTEM
      if (input.orderType === "online" && userId) {
        try {
          await ReferralService.qualifyReferral(
            userId,
            order._id,
            totalAmount,
            session,
          );
        } catch (err: any) {
          console.warn("Referral qualification failed:", err.message);
        }
      }

      if (userId && !!order) {
        await UserStatsService.onOrderPlaced(userId);
      }

      await session.commitTransaction();

      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  async cancelOrder(
    orderId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    const session = await mongoose.startSession();

    try {
      let cancelledOrder: any;

      await session.withTransaction(async () => {
        const order = await OrderRepository.findById(
          new Types.ObjectId(orderId),
          session,
        );
        if (!order) throw new AppError("Order not found", 404);

        if (order.user?.toString() !== userId) {
          throw new AppError("Not authorized", 403);
        }

        if (!["pending"].includes(order.status)) {
          throw new AppError(
            `Order cannot be cancelled at ${order.status}`,
            400,
          );
        }

        const items = await OrderItemRepository.findManyByIds(
          order.items,
          session,
        );

        for (const item of items) {
          await ProductService.restoreStock(
            new Types.ObjectId(item.product.id),
            new Types.ObjectId(item.color.id),
            new Types.ObjectId(item.size.id),
            item.quantity,
            session,
          );
        }

        cancelledOrder = await OrderRepository.updateById(
          order._id,
          {
            status: "cancelled",
            cancellationDate: new Date(),
          },
          session,
        );
      });

      return cancelledOrder;
    } finally {
      await session.endSession();
    }
  },

  async getMyOrders({ userId, page = 1, limit = 10, status }: any) {
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      OrderRepository.findUserOrders(new Types.ObjectId(userId), filter, {
        skip,
        limit,
      }),
      OrderRepository.count({
        user: userId,
        ...(status ? { status } : {}),
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getSingleOrder(orderId: string | Types.ObjectId, user: any) {
    const order = await OrderRepository.findById(new Types.ObjectId(orderId));
    if (!order) throw new AppError("Order not found", 404);

    if (
      user.role !== "admin" &&
      order.user?.toString() !== user._id.toString()
    ) {
      throw new AppError("Not authorized", 403);
    }

    return order;
  },

  async getAllOrders({ page = 1, limit = 20, status, userId }: any) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;

    const [orders, total] = await Promise.all([
      OrderRepository.findAll(filter, { skip, limit }),
      OrderRepository.count(filter),
    ]);

    return {
      orders,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async markDelivered(orderId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const deliveredAt = new Date();

      const order = await OrderRepository.markDelivered(
        orderId,
        deliveredAt,
        session,
      );

      // Trigger referral holding logic (if exists)
      await ReferralService.holdReferral(order.user!, new Date());

      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  async updateOrderStatus(
    orderId: string | Types.ObjectId,
    nextStatus: OrderStatus,
  ) {
    const session = await mongoose.startSession();

    try {
      let updated: any;

      await session.withTransaction(async () => {
        const order = await OrderRepository.findById(
          new Types.ObjectId(orderId),
          session,
        );
        if (!order) throw new AppError("Order not found", 404);

        const allowed = ALLOWED_TRANSITIONS[order.status] || [];
        if (!allowed.includes(nextStatus)) {
          throw new AppError(
            `Cannot change status from ${order.status} to ${nextStatus}`,
            400,
          );
        }

        updated = await OrderRepository.updateById(
          order._id,
          { status: nextStatus },
          session,
        );
      });

      return updated;
    } finally {
      await session.endSession();
    }
  },
};
