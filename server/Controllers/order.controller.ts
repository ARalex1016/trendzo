import type { Request, Response } from "express";

// Services
import { OrderService } from "../Services/order.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import AppError from "../Utils/AppError.ts";

/* =========================================================
   USER ROUTES
========================================================= */

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;

  if (!user.isEmailVerified) {
    throw new AppError(
      "You must verify your email address to continue with checkout.",
      403,
    );
  }

  const order = await OrderService.placeOrder({
    ...req.body,

    // These values MUST come from the authenticated user/server.
    userId: user._id.toString(),
    orderType: "online",
  });

  res.status(201).json({
    status: "success",
    message: "Order placed successfully",
    data: order,
  });
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await OrderService.getMyOrders({
    ...req.query,
    userId: req.user!._id,
  });

  res.status(200).json({
    status: "success",
    ...result,
  });
});

export const getSingleOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await OrderService.getSingleOrder({
      order: req.targetOrder!,
    });

    res.status(200).json({
      status: "success",
      data,
    });
  },
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

/* =========================================================
   ADMIN / OPERATOR ROUTES
========================================================= */

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders(req.query);

    res.status(200).json({
      status: "success",
      data: result.orders,
      meta: result.meta,
    });
  },
);

export const placeStoreOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    if (user.role !== "admin" && user.role !== "operator") {
      throw new AppError(
        "Only admin and operator can place in-store orders.",
        403,
      );
    }

    const order = await OrderService.placeOrder({
      ...req.body,

      // In-store order is created by the authenticated
      // admin/operator.
      cashierId: user._id.toString(),

      orderType: "in_store",
    });

    res.status(201).json({
      status: "success",
      message: "In-store order created successfully",
      data: order,
    });
  },
);

export const verifyManualPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const order = req.targetOrder!;

    const { amount } = req.body;

    const updatedOrder = await OrderService.verifyManualPayment({
      order: order,
      amount,
      verifiedBy: req.user!._id,
    });

    res.status(200).json({
      status: "success",
      message: "Manual payment verified successfully",
      data: updatedOrder,
    });
  },
);

export const confirmOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const order = req.targetOrder!;

    const confirmedOrder = await OrderService.confirmOrder(order._id);

    res.status(200).json({
      status: "success",
      message: "Order confirmed successfully",
      data: confirmedOrder,
    });
  },
);

export const markOrderDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.targetOrder!._id;

    const order = await OrderService.markDelivered(orderId);

    res.status(200).json({
      status: "success",
      message: "Order marked as delivered",
      data: order,
    });
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.targetOrder!._id;

    const order = await OrderService.updateOrderStatus(
      orderId,
      req.body.status,
    );

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: order,
    });
  },
);
