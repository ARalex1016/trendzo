import mongoose from "mongoose";
import type { Request, Response } from "express";

// Services
import { PaymentMethodService } from "../Services/payment-method.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import AppError from "../Utils/AppError.ts";

// User
export const getMyPaymentMethods = asyncHandler(
  async (req: Request, res: Response) => {
    const methods = await PaymentMethodService.getAllByUser(req.user!._id);

    res.status(200).json({
      status: "success",
      data: methods,
    });
  }
);

export const getPaymentMethodById = asyncHandler(
  async (req: Request, res: Response) => {
    const targetPaymentMethod = req.targetPaymentMethod!;
    const user = req.user!;

    const method = await PaymentMethodService.getById(
      targetPaymentMethod._id,
      user._id,
      user.role === "admin"
    );

    res.status(200).json({
      status: "success",
      data: method,
    });
  }
);

export const addPaymentMethod = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const method = await PaymentMethodService.addPaymentMethod(
        user._id,
        req.body,
        session
      );

      await session.commitTransaction();

      // Success
      res.status(201).json({
        status: "success",
        data: method,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
);

export const updatePaymentMethodById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const targetPaymentMethod = req.targetPaymentMethod!;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedMethod = await PaymentMethodService.update(
        targetPaymentMethod._id,
        user!._id,
        req.body,
        req.user!.role === "admin",
        session
      );

      await session.commitTransaction();

      // Success
      res.status(200).json({
        status: "success",
        data: updatedMethod,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
);

export const setDefault = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const targetPaymentMethod = req.targetPaymentMethod!;

  if (targetPaymentMethod.user.equals(user._id))
    throw new AppError("Unauthorized", 403);

  const session = await mongoose.startSession();
  session.startTransaction(); // start transaction

  try {
    const newDefaultMethod = await PaymentMethodService.setDefault(
      targetPaymentMethod._id,
      user._id,
      session
    );

    if (!newDefaultMethod) {
      throw new AppError("Failed to set default payment method", 400);
    }

    await session.commitTransaction();

    // Success
    res.status(200).json({
      status: "success",
      message: "Default payment method updated",
      data: newDefaultMethod,
    });
  } catch (error) {
    await session.abortTransaction(); // rollback if error
    throw error;
  } finally {
    session.endSession(); // close session
  }
});

export const deletePaymentMethodById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const targetPaymentMethod = req.targetPaymentMethod!;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await PaymentMethodService.delete(
        targetPaymentMethod._id,
        user!._id,
        user!.role === "admin",
        session
      );
      await session.commitTransaction();

      // Success
      res.status(200).json({
        status: "success",
        message: "Deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
);

// Admin
export const getAllPaymentMethods = asyncHandler(
  async (req: Request, res: Response) => {
    // Admin can filter by userId query param
    const filter: any = {};

    if (req.query.userId) filter.user = req.query.userId;

    const methods = await PaymentMethodService.getAllByUser(
      filter.user || undefined
    );

    // Success
    res.status(200).json({
      status: "success",
      data: methods,
    });
  }
);
