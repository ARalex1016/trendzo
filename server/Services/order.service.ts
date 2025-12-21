import mongoose, { Types } from "mongoose";

// Repository
import { OrderRepository } from "./../Repositories/order.repository.ts";
import { OrderItemRepository } from "../Repositories/orderItem.repository.ts";
import { ProductService } from "./product.service.ts";
import { PricingService } from "./pricing.service.ts";
import { ProductRepository } from "./../Repositories/product.repository.ts";

// Service
import { CouponService } from "./../Services/coupon.service.ts";
import { DeliveryService } from "./../Services/delivery.service.ts";
import { ReferralService } from "../Services/referral.service.ts";

// Utils
import AppError from "./../Utils/AppError.ts";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  placed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: [],
  cancelled: [],
  returned: [],
};

export const OrderService = {
  async placeOrder(input: {
    userId: string;
    items: { product: string; color: string; size: string; quantity: number }[];
    paymentMethod: string;
    deliveryAddress: any;
    couponCode?: string;
    orderNote?: string;
  }) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const userId = new Types.ObjectId(input.userId);

      // Validate and consume coupon
      const coupon = input.couponCode
        ? await CouponService.validateAndConsumeCoupon(
            input.couponCode,
            userId,
            session
          )
        : null;

      let itemsTotal = 0;
      const orderItemIds: Types.ObjectId[] = [];

      for (const item of input.items) {
        // Fetch product from DB
        const product = await ProductRepository.findById(
          new Types.ObjectId(item.product)
        ).lean();
        if (!product) throw new AppError("Product not found", 404);

        // Find variant & size
        const variant = product.variants?.find(
          (v: any) => v.color === item.color
        );
        if (!variant)
          throw new AppError(`Variant "${item.color}" not found`, 400);

        const sizeObj = variant.sizes?.find((s: any) => s.size === item.size);
        if (!sizeObj) throw new AppError(`Size "${item.size}" not found`, 400);

        // Calculate price using PricingService
        const unitPrice = PricingService.calculateItemPrice(
          sizeObj.price,
          variant.basePrice,
          product.basePrice
        );

        // Decrement stock
        const res = await ProductRepository.decrementStock(
          new Types.ObjectId(item.product),
          item.color,
          item.size,
          item.quantity,
          session
        );

        if (res.matchedCount === 0) {
          throw new AppError(
            `Insufficient stock for product ${product.name} (${item.color}, ${item.size})`,
            400
          );
        }

        // Create order item
        const orderItem = await OrderItemRepository.create(
          {
            product: item.product,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: unitPrice,
          },
          session
        );

        itemsTotal += unitPrice * item.quantity;
        orderItemIds.push(orderItem._id);
      }

      // Calculate discount
      const discount = coupon
        ? Math.min(
            coupon.type === "percentage"
              ? (itemsTotal * coupon.value) / 100
              : coupon.value,
            coupon.maxDiscount ?? Infinity
          )
        : 0;

      // Calculate delivery charge
      const deliveryCharge = await DeliveryService.calculateCharge(
        input.deliveryAddress
      );

      const totalAmount = Math.max(0, itemsTotal - discount + deliveryCharge);

      // Create order
      const order = await OrderRepository.create(
        {
          user: userId,
          items: orderItemIds,
          totalAmount,
          discount,
          deliveryCharge,
          paymentMethod: input.paymentMethod,
          paymentStatus: "pending",
          status: "placed",
          deliveryAddress: input.deliveryAddress,
          orderNote: input.orderNote,
          ...(coupon ? { coupon: coupon._id } : {}),
        },
        session
      );

      // Try to qualify referral, but DO NOT throw error if it fails
      try {
        await ReferralService.qualifyReferral(
          userId, // invitee
          order._id, // qualifying order
          totalAmount, // order amount to check minimum
          session
        );
      } catch (referralErr: any) {
        console.warn("Referral qualification failed:", referralErr.message);
        // Optionally: log to monitoring system instead of console.warn
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
    userId: string | Types.ObjectId
  ) {
    const session = await mongoose.startSession();

    try {
      let cancelledOrder: any;

      await session.withTransaction(async () => {
        const order = await OrderRepository.findById(
          new Types.ObjectId(orderId),
          session
        );
        if (!order) throw new AppError("Order not found", 404);

        if (order.user.toString() !== userId) {
          throw new AppError("Not authorized", 403);
        }

        if (!["placed", "processing"].includes(order.status)) {
          throw new AppError(
            `Order cannot be cancelled at ${order.status}`,
            400
          );
        }

        const items = await OrderItemRepository.findManyByIds(
          order.items,
          session
        );

        for (const item of items) {
          await ProductService.restoreStock(
            item.product,
            item.color,
            item.size,
            item.quantity,
            session
          );
        }

        cancelledOrder = await OrderRepository.updateById(
          order._id,
          {
            status: "cancelled",
            cancellationDate: new Date(),
          },
          session
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
      orders,
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
      order.user.toString() !== user._id.toString()
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
        session
      );

      // Trigger referral holding logic (if exists)
      await ReferralService.holdReferral(order.user, new Date());

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
    nextStatus: string
  ) {
    const session = await mongoose.startSession();

    try {
      let updated: any;

      await session.withTransaction(async () => {
        const order = await OrderRepository.findById(
          new Types.ObjectId(orderId),
          session
        );
        if (!order) throw new AppError("Order not found", 404);

        const allowed = ALLOWED_TRANSITIONS[order.status] || [];
        if (!allowed.includes(nextStatus)) {
          throw new AppError(
            `Cannot change status from ${order.status} to ${nextStatus}`,
            400
          );
        }

        updated = await OrderRepository.updateById(
          order._id,
          { status: nextStatus },
          session
        );
      });

      return updated;
    } finally {
      await session.endSession();
    }
  },
};
