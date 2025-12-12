import { Types } from "mongoose";

// Models
import Coupon, { type ICoupon } from "../Models/coupon.model.ts";

export const CouponRepository = {
  async create(data: Partial<ICoupon>) {
    return Coupon.create(data);
  },

  async findById(id: Types.ObjectId) {
    return Coupon.findById(id);
  },

  async findByCode(code: string, excludeId?: Types.ObjectId) {
    const query: any = { code };
    if (excludeId) query._id = { $ne: excludeId };
    return Coupon.findOne(query);
  },

  async findAll(filter: any = {}) {
    return Coupon.find(filter).sort({ createdAt: -1 });
  },

  async updateById(id: Types.ObjectId, updates: Partial<ICoupon>) {
    return Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: Types.ObjectId) {
    return Coupon.findByIdAndDelete(id);
  },

  // Transactional methods
  async findByCodeWithSession(code: string, session: any) {
    return Coupon.findOne({ code }).session(session);
  },

  async incrementUsedCount(couponId: Types.ObjectId, session: any) {
    return Coupon.findByIdAndUpdate(
      couponId,
      { $inc: { usedCount: 1 } },
      { new: true, session }
    );
  },
};
