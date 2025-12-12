import mongoose from "mongoose";
import type { Request, Response } from "express";

// Models
import Order, { type OrderStatus } from "../Models/order.model.ts";
import OrderItem from "../Models/order-item.model.ts";
import Product, { type IProduct } from "../Models/product.model.ts";
import Coupon from "../Models/coupon.model.ts";

// Utils
import AppError from "../Utils/AppError.ts";
import { isValidObjectId } from "../Utils/mongoose.management.ts";

// Services
import {
  placeOrder,
  cancelOrderService,
  getMyOrdersService,
} from "../Services/order.service.ts";

const allowedStatuses: OrderStatus[] = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

// USER ROUTES
export const placeOrderController = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const {
    items,
    paymentMethod,
    deliveryCharge = 0,
    deliveryAddress,
    orderNote,
    couponCode,
  } = req.body;

  try {
    const payload = {
      userId: String(userId),
      items: items,
      deliveryCharge: deliveryCharge,
      paymentMethod: paymentMethod,
      deliveryAddress: deliveryAddress,
      orderNote: orderNote,
      couponCode: couponCode,
    };

    const result = await placeOrder(payload);

    return res.status(201).json({
      status: "success",
      data: result.order,
      message: "Order placed successfully",
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status as string | undefined;

  try {
    const data = await getMyOrdersService({ userId, page, limit, status });

    // Success logic here
    res.status(200).json({
      status: "success",
      meta: {
        total: data.totalOrders,
        page: data.page,
        limit: data.limit,
        pages: data.totalPages,
      },
      orders: data.orders,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const getSingleOrder = async (req: Request, res: Response) => {
  const user = req.user!;
  const order = req.targetOrder!;

  try {
    if (
      user &&
      user.role !== "admin" &&
      order.user._id.toString() !== user._id.toString()
    ) {
      throw new AppError("You are not authorized to access this order", 403);
    }

    // Format order for response
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

    const formattedOrder = {
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

    // Success logic here
    res.status(200).json({
      status: "success",
      order: formattedOrder,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const orderId = req.targetOrder!._id.toString();
  const userId = req.user!._id.toString();

  try {
    const cancelledOrder = await cancelOrderService(orderId, userId);

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
      data: {
        orderId: cancelledOrder._id,
        status: cancelledOrder.status,
        cancellationDate: cancelledOrder.cancellationDate,
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

// ADMIN / OPERATOR ROUTES
export const getAllOrders = async (req: Request, res: Response) => {
  // --- Pagination ---
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  // --- Optional Filters ---
  const status = req.query.status as string | undefined;
  const userId = req.query.userId as string | undefined;

  try {
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;

    // --- Fetch orders ---
    const orders = await Order.find(filter)
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name slug variants",
        },
      })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .lean();

    const totalOrders = await Order.countDocuments(filter);

    // --- Format orders ---
    const formattedOrders = orders.map((order) => {
      const itemsSnapshot = (order.items as any[]).map((item) => ({
        id: item._id,
        product: {
          id: item.product?._id,
          name: item.product?.name ?? "Product",
          slug: item.product?.slug,
          image: item.product?.variants?.[0]?.images?.[0] ?? null,
        },
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
      }));

      const itemsTotal = itemsSnapshot.reduce(
        (sum, it) => sum + it.subtotal,
        0
      );

      return {
        id: order._id,
        user: order.user,
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

    // Success logic here
    res.status(200).json({
      status: "success",
      meta: {
        total: totalOrders,
        page: page,
        limit: limit,
        pages: Math.ceil(totalOrders / limit),
      },
      orders: formattedOrders,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const order = req.targetOrder!;
    const { status } = req.body;
    if (!status || !allowedStatuses.includes(status)) {
      throw new AppError(
        `Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}`,
        400
      );
    }
    await session.withTransaction(async () => {
      // Prevent invalid transitions (example: cannot move cancelled or returned to other status)
      if (["cancelled", "returned"].includes(order.status)) {
        throw new AppError(
          `Cannot update status of an order that is already ${order.status}`,
          400
        );
      }

      // Optional: define allowed transitions (example)
      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        placed: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered", "returned"],
        delivered: [],
        cancelled: [],
        returned: [],
      };

      if (!validTransitions[order.status].includes(status)) {
        throw new AppError(
          `Cannot change status from ${order.status} to ${status}`,
          400
        );
      }

      // Update status
      order.status = status as OrderStatus;

      // If cancelled, add cancellation date
      if (status === "cancelled") order.cancellationDate = new Date();
      await order.save({ session });
    });
    const updatedOrder = await Order.findById(order._id)
      .populate({
        path: "items",
        populate: { path: "product", select: "name slug variants" },
      })
      .lean();

    // Success logic here
    res.status(200).json({
      status: "success",
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};
