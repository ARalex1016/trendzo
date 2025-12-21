import type { Request, Response } from "express";

// Services
import { OrderService } from "../Services/order.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import AppError from "../Utils/AppError.ts";

// const allowedStatuses: OrderStatus[] = [
//   "placed",
//   "processing",
//   "shipped",
//   "delivered",
//   "cancelled",
//   "returned",
// ];

// USER ROUTES
export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;

  if (!user.isEmailVerified) {
    return new AppError(
      "You must verify your email address to continue with checkout.",
      403
    );
  }

  const order = await OrderService.placeOrder({
    userId: user._id,
    ...req.body,
  });

  res.status(201).json({
    status: "success",
    message: "Order placed successfully",
    data: order,
  });
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await OrderService.getMyOrders({
    userId: req.user!._id,
    ...req.query,
  });

  res.status(200).json({ status: "success", ...result });
});

export const getSingleOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.targetOrder!._id;

    const order = await OrderService.getSingleOrder(orderId, req.user);

    res.status(200).json({ status: "success", order });
  }
);

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.targetOrder!._id;

  const order = await OrderService.cancelOrder(orderId, req.user!._id);

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
    data: order,
  });
});

// ADMIN / OPERATOR ROUTES
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders(req.query);
    res.status(200).json({ status: "success", ...result });
  }
);

export const markOrderDelivered = asyncHandler(async (req, res) => {
  const orderId = req.targetOrder!._id;

  const order = await OrderService.markDelivered(orderId);

  res.status(200).json({
    status: "success",
    data: order,
  });
});

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.targetOrder!._id;

    const order = await OrderService.updateOrderStatus(
      orderId,
      req.body.status
    );

    res.status(200).json({
      status: "success",
      message: "Order status updated",
      order,
    });
  }
);
