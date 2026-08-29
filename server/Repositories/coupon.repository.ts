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

  async findByCode(
    code: string,
    excludeId?: Types.ObjectId,
    fields?: string[],
  ): Promise<ICoupon | null> {
    const query: Record<string, unknown> = { code };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    let mongooseQuery = Coupon.findOne(query);

    // Apply field selection if provided
    if (fields && fields.length > 0) {
      mongooseQuery = mongooseQuery.select(fields.join(" "));
    }

    return mongooseQuery.exec();
  },

  async findAll(filter: Record<string, unknown> = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

      Coupon.countDocuments(filter),
    ]);

    const meta = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return {
      coupons,
      meta,
    };
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
      { new: true, session },
    );
  },
};
