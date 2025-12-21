import { Types } from "mongoose";
import type { ICoupon } from "../Models/coupon.model.ts";

// Repository
import { CouponRepository } from "../Repositories/coupon.repository.ts";
import { OrderRepository } from "../Repositories/order.repository.ts";

// Utils
import AppError from "../Utils/AppError.ts";
import { capitalizeString } from "../Utils/stringManager.ts";

export const CouponService = {
  async isCouponCodeTaken(code: string, excludeId?: Types.ObjectId) {
    const existing = await CouponRepository.findByCode(code, excludeId);
    return !!existing;
  },

  async createCoupon(data: any, creatorId: Types.ObjectId) {
    if (await this.isCouponCodeTaken(data.code)) {
      throw new AppError("Coupon code already exists", 400);
    }

    return CouponRepository.create({
      ...data,
      code: capitalizeString(data.code),
      createdBy: creatorId,
    });
  },

  async getCouponById(id: Types.ObjectId) {
    const coupon = await CouponRepository.findById(id);
    if (!coupon) throw new AppError("Coupon not found", 404);
    return coupon;
  },

  async getAllCoupons(filter: any = {}) {
    return CouponRepository.findAll(filter);
  },

  async updateCoupon(id: Types.ObjectId, updates: any) {
    if (updates.code) {
      updates.code = capitalizeString(updates.code);
      if (await this.isCouponCodeTaken(updates.code, id)) {
        throw new AppError("Coupon code already exists", 400);
      }
    }
    const updated = await CouponRepository.updateById(id, updates);
    if (!updated) throw new AppError("Coupon not found", 404);
    return updated;
  },

  async toggleCouponStatus(id: Types.ObjectId) {
    const coupon = await this.getCouponById(id);
    coupon.status = coupon.status === "active" ? "inactive" : "active";
    await coupon.save();
    return coupon;
  },

  async deleteCoupon(id: Types.ObjectId) {
    await this.getCouponById(id);
    await CouponRepository.deleteById(id);
  },

  async validateCoupon(code: string) {
    const coupon = await CouponRepository.findByCode(code);
    if (!coupon) throw new AppError("Invalid coupon code", 404);
    if (coupon.status !== "active")
      throw new AppError("Coupon is inactive", 400);
    if (coupon.expiryDate < new Date())
      throw new AppError("Coupon has expired", 400);

    return coupon;
  },

  async applyCoupon({ code, totalAmount, isFirstTimeUser }: any) {
    const coupon = await this.validateCoupon(code);

    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
      throw new AppError(
        `Minimum purchase should be NPR ${coupon.minPurchase}`,
        400
      );
    }

    if (coupon.applicableUsers === "firstTime" && !isFirstTimeUser) {
      throw new AppError("Coupon only for first-time users", 403);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError("Coupon usage limit reached", 400);
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (totalAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount)
        discount = coupon.maxDiscount;
    } else {
      discount = coupon.value;
    }

    const finalAmount = totalAmount - discount;
    return { discount, finalAmount };
  },

  // -------------------------
  // Transactional / consume coupon
  // -------------------------
  async validateAndConsumeCoupon(
    couponCode: string,
    userId: Types.ObjectId,
    session: any
  ): Promise<ICoupon> {
    const coupon = await CouponRepository.findByCodeWithSession(
      couponCode,
      session
    );
    if (!coupon) throw new AppError("Coupon not found", 404);
    if (coupon.status !== "active") throw new AppError("Coupon inactive", 400);
    if (coupon.expiryDate && coupon.expiryDate < new Date())
      throw new AppError("Coupon expired", 400);
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit)
      throw new AppError("Coupon usage limit reached", 400);

    if (coupon.applicableUsers === "firstTime") {
      const previousOrders = await OrderRepository.countUserOrders(
        userId,
        session
      );
      if (previousOrders > 0)
        throw new AppError("Coupon only valid for first-time buyers", 400);
    }

    // Increment usedCount in transaction
    await CouponRepository.incrementUsedCount(coupon._id, session);

    return coupon;
  },
};
