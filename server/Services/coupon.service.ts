// services/coupon.service.ts
import { Types } from "mongoose";

// Models
import Coupon, { type ICoupon } from "../Models/coupon.model.ts";
import Order from "../Models/order.model.ts";
import User from "../Models/user.model.ts";

// Utils
import AppError from "../Utils/AppError.ts";

export const validateAndConsumeCoupon = async (
  couponCode: string,
  userId: Types.ObjectId,
  session: any // mongoose session
): Promise<ICoupon> => {
  if (!couponCode) throw new AppError("No coupon provided", 400);

  const coupon = await Coupon.findOne({ code: couponCode }).session(session);

  if (!coupon) throw new AppError("Coupon not found", 404);

  if (coupon.status !== "active") throw new AppError("Coupon inactive", 400);

  if (coupon.expiryDate && coupon.expiryDate < new Date())
    throw new AppError("Coupon expired", 400);

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit)
    throw new AppError("Coupon usage limit reached", 400);

  // Check applicableUsers rules:
  if (coupon.applicableUsers === "firstTime") {
    const previousOrders = await Order.countDocuments({ user: userId }).session(
      session
    );
    if (previousOrders > 0)
      throw new AppError("Coupon only valid for first-time buyers", 400);
  }

  // Reserve consume: increment usedCount now (will be inside the transaction)
  coupon.usedCount = (coupon.usedCount ?? 0) + 1;
  await coupon.save({ session });

  return coupon;
};
