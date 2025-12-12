// services/order.service.ts
import mongoose, { Types } from "mongoose";

// Models
import Order, { type IOrder } from "./../Models/order.model.ts";
import OrderItem, { type IOrderItem } from "./../Models/order-item.model.ts";
import Product from "./../Models/product.model.ts";
import User from "./../Models/user.model.ts";

// Services
import { validateAndConsumeCoupon } from "./coupon.service.ts";
import { calculateItemPrice } from "./pricing.service.ts";
import {
  decrementProductStock,
  restoreProductStock,
} from "./product.service.ts";

// Utils
import AppError from "../Utils/AppError.ts";

type PlaceOrderItemInput = {
  product: string; // productId string
  color: string;
  size: string;
  quantity: number;
};

type PlaceOrderInput = {
  userId: string;
  items: PlaceOrderItemInput[];
  deliveryCharge?: number;
  paymentMethod: "bank" | "esewa" | "khalti" | "cod";
  deliveryAddress: any;
  orderNote?: string;
  couponCode?: string;
};

interface GetMyOrdersOptions {
  userId: string;
  page?: number;
  limit?: number;
  status?: string | undefined; // optional filter
}

export const placeOrder = async (payload: PlaceOrderInput) => {
  const session = await mongoose.startSession();
  try {
    let orderResult: any = null;

    await session.withTransaction(async () => {
      const userId = new Types.ObjectId(payload.userId);

      // Check if user exists
      const user = await User.findById(userId).session(session);
      if (!user) throw new AppError("User not found", 404);

      // Validate coupon (if provided)
      let couponDoc: any = null;
      if (payload.couponCode) {
        try {
          couponDoc = await validateAndConsumeCoupon(
            payload.couponCode,
            userId,
            session
          );
        } catch (err) {
          throw err;
        }
      }

      // Prepare order items
      const orderItemsToCreate: IOrderItem[] = [];
      const orderItemSnapshots: any[] = [];
      let itemsTotal = 0;

      for (const it of payload.items) {
        const productId = new Types.ObjectId(it.product);

        // Get price
        const unitPrice = await calculateItemPrice(
          productId,
          it.color,
          it.size
        );
        const subtotal = unitPrice * it.quantity;

        // Decrement stock
        const ok = await decrementProductStock(
          productId,
          it.color,
          it.size,
          it.quantity,
          session
        );
        if (!ok)
          throw new AppError(
            `Insufficient stock for product ${it.product} (${it.color}/${it.size})`,
            400
          );

        // Create OrderItem doc
        const orderItemDoc = new OrderItem({
          product: productId,
          color: it.color,
          size: it.size,
          quantity: it.quantity,
          price: unitPrice,
        });
        await orderItemDoc.save({ session });
        orderItemsToCreate.push(orderItemDoc);

        // Snapshot for response
        const productDoc = await Product.findById(productId)
          .select("name slug variants")
          .lean()
          .session(session);

        orderItemSnapshots.push({
          product: {
            id: productId,
            name: productDoc?.name ?? "Product",
            slug: productDoc?.slug,
            image:
              productDoc?.variants?.find((v: any) => v.color === it.color)
                ?.images?.[0] ??
              productDoc?.variants?.[0]?.images?.[0] ??
              null,
          },
          color: it.color,
          size: it.size,
          quantity: it.quantity,
          unitPrice,
          subtotal,
        });

        itemsTotal += subtotal;
      }

      // Calculate discount
      let discountAmount = 0;
      if (couponDoc) {
        discountAmount =
          couponDoc.type === "percentage"
            ? (itemsTotal * couponDoc.value) / 100
            : couponDoc.value;

        if (couponDoc.maxDiscount != null) {
          discountAmount = Math.min(discountAmount, couponDoc.maxDiscount);
        }
      }

      const deliveryCharge = payload.deliveryCharge ?? 0;
      const totalPayable = Math.max(
        0,
        itemsTotal - discountAmount + deliveryCharge
      );

      // Create Order doc
      const orderDoc = new Order({
        user: userId,
        items: orderItemsToCreate.map((oi) => oi._id),
        totalAmount: totalPayable,
        discount: discountAmount,
        deliveryCharge,
        paymentMethod: payload.paymentMethod,
        paymentStatus: "pending",
        status: "placed",
        deliveryAddress: payload.deliveryAddress,
        ...(couponDoc ? { coupon: couponDoc._id } : {}),
        ...(payload.orderNote ? { orderNote: payload.orderNote } : {}),
      });

      await orderDoc.save({ session });

      // Prepare result
      orderResult = {
        order: {
          id: orderDoc._id,
          items: orderItemSnapshots,
          totals: {
            itemsTotal,
            discount: discountAmount,
            deliveryCharge,
            payable: totalPayable,
          },
          payment: {
            method: payload.paymentMethod,
            status: orderDoc.paymentStatus,
          },
          deliveryAddress: orderDoc.deliveryAddress,
          ...(orderDoc.orderNote ? { orderNote: orderDoc.orderNote } : {}),
          createdAt: orderDoc.createdAt,
        },
      };
    });

    return orderResult;
  } finally {
    await session.endSession();
  }
};

// Cancel order service
export const cancelOrderService = async (orderId: string, userId?: string) => {
  const session = await mongoose.startSession();

  try {
    let canceledOrder: any = null;

    await session.withTransaction(async () => {
      const orderObjectId = new Types.ObjectId(orderId);

      // Fetch order with items
      const order = await Order.findById(orderObjectId)
        .populate("items")
        .session(session);

      if (!order) throw new AppError("Order not found", 404);

      // Optional: restrict cancellation to order owner
      if (userId && order.user.toString() !== userId) {
        throw new AppError("You are not authorized to cancel this order", 403);
      }

      // Check if order is cancellable
      if (
        ["cancelled", "shipped", "delivered", "returned"].includes(order.status)
      ) {
        throw new AppError(
          `Order cannot be cancelled at status: ${order.status}`,
          400
        );
      }

      // Restore stock for each order item
      const orderItems = await OrderItem.find({
        _id: { $in: order.items },
      }).session(session);

      for (const item of orderItems) {
        await restoreProductStock(
          item.product as Types.ObjectId,
          item.color,
          item.size,
          item.quantity,
          session
        );
      }

      // Update order status to cancelled
      order.status = "cancelled";
      order.cancellationDate = new Date();
      await order.save({ session });

      canceledOrder = order;
    });

    return canceledOrder;
  } finally {
    await session.endSession();
  }
};

export const getMyOrdersService = async (options: GetMyOrdersOptions) => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;
  const skip = (page - 1) * limit;

  const userObjectId = new Types.ObjectId(options.userId);

  // Build filter
  const filter: any = { user: userObjectId };
  if (options.status) filter.status = options.status;

  // Fetch total count for pagination
  const totalOrders = await Order.countDocuments(filter);

  // Fetch orders with items populated
  const orders: IOrder[] = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "items",
      model: OrderItem,
      populate: {
        path: "product",
        model: Product,
        select: "name slug variants",
      },
    })
    .lean();

  // Transform data for response (snapshot style)
  const formattedOrders = orders.map((order) => {
    const itemsSnapshot = (order.items as any[]).map((item) => ({
      id: item._id,
      product: {
        id: item.product?._id,
        name: item.product?.name ?? "Product",
        slug: item.product?.slug,
        image:
          item.product?.variants?.find((v: any) => v.color === item.color)
            ?.images?.[0] ??
          item.product?.variants?.[0]?.images?.[0] ??
          null,
      },
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
    }));

    const itemsTotal = itemsSnapshot.reduce((sum, it) => sum + it.subtotal, 0);

    return {
      id: order._id,
      items: itemsSnapshot,
      totals: {
        itemsTotal,
        discount: order.discount ?? 0,
        deliveryCharge: order.deliveryCharge ?? 0,
        payable: order.totalAmount,
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
      },
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      orderNote: order.orderNote ?? null,
      createdAt: order.createdAt,
      cancellationDate: order.cancellationDate ?? null,
    };
  });

  return {
    totalOrders,
    page,
    limit,
    totalPages: Math.ceil(totalOrders / limit),
    orders: formattedOrders,
  };
};
