import { Types, type ClientSession } from "mongoose";

// Repositories
import { PaymentMethodRepository } from "../Repositories/payment-method.repository.ts";

// Utils
import AppError from "../Utils/AppError.ts";

export const PaymentMethodService = {
  // Create new payment method
  async addPaymentMethod(
    userId: Types.ObjectId,
    data: any,
    session?: ClientSession
  ) {
    if (
      data.type === "bank" &&
      (!data.details?.accountName ||
        !data.details?.accountNumber ||
        !data.details?.bankName)
    ) {
      throw new AppError("Bank details are required", 400);
    }

    if (
      (data.type === "esewa" || data.type === "khalti") &&
      !data.details?.phone
    ) {
      throw new AppError("Phone number is required for eSewa/Khalti", 400);
    }

    // If isDefault=true, unset existing defaults
    if (data.isDefault) {
      await PaymentMethodRepository.updateByUserId(
        { user: userId, isDefault: true },
        { isDefault: false },
        session
      );
    }

    return PaymentMethodRepository.create({ user: userId, ...data }, session);
  },

  // Set a payment method as default
  async setDefault(
    methodId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession
  ) {
    // Unset previous defaults
    await PaymentMethodRepository.updateByUserId(
      {
        user: userId,
        isDefault: true,
      },
      { isDefault: false },
      session
    );

    // Set new default
    return PaymentMethodRepository.setDefault(methodId, session);
  },

  // Get all methods for a user
  async getAllByUser(userId: Types.ObjectId, session?: ClientSession) {
    return PaymentMethodRepository.findAllByUser(userId, session);
  },

  // Get single method (user/admin check done in controller)
  async getById(
    methodId: Types.ObjectId,
    userId?: Types.ObjectId,
    isAdmin?: boolean,
    session?: ClientSession
  ) {
    const method = await PaymentMethodRepository.findById(methodId, session);
    if (!method) throw new AppError("Payment method not found", 404);
    if (!isAdmin && userId && !method.user.equals(userId))
      throw new AppError("Unauthorized", 403);
    return method;
  },

  // Update payment method
  async update(
    methodId: Types.ObjectId,
    userId: Types.ObjectId,
    data: any,
    isAdmin?: boolean,
    session?: ClientSession
  ) {
    const method = await PaymentMethodRepository.findById(methodId, session);
    if (!method) throw new AppError("Payment method not found", 404);
    if (!isAdmin && !method.user.equals(userId))
      throw new AppError("Unauthorized", 403);

    // Validate type-specific fields
    if (
      data.type === "bank" &&
      (!data.details?.accountName ||
        !data.details?.accountNumber ||
        !data.details?.bankName)
    ) {
      throw new AppError("Bank details are required", 400);
    }
    if (
      (data.type === "esewa" || data.type === "khalti") &&
      !data.details?.phone
    ) {
      throw new AppError("Phone number is required for eSewa/Khalti", 400);
    }

    // Handle isDefault update
    if (data.isDefault) {
      await PaymentMethodRepository.updateByUserId(
        { user: method.user, isDefault: true },
        { isDefault: false },
        session
      );
    }

    return PaymentMethodRepository.update(methodId, data, session);
  },

  // Delete payment method
  async delete(
    methodId: Types.ObjectId,
    userId: Types.ObjectId,
    isAdmin?: boolean,
    session?: ClientSession
  ) {
    const method = await PaymentMethodRepository.findById(methodId, session);
    if (!method) throw new AppError("Payment method not found", 404);
    if (!isAdmin && !method.user.equals(userId))
      throw new AppError("Unauthorized", 403);

    // TODO: Check if used in pending withdrawals
    // const used = await WithdrawalRepository.exists({ paymentMethod: methodId, status: "processing" });
    // if (used) throw new AppError("Cannot delete method used in pending withdrawals", 400);

    return PaymentMethodRepository.delete(methodId, session);
  },
};
