import type { Request, Response, NextFunction } from "express";

// Services
import { CouponService } from "../Services/coupon.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import AppError from "../Utils/AppError.ts";

export const createCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupon = await CouponService.createCoupon(req.body, req.user!._id);
    res
      .status(201)
      .json({ status: "success", message: "Coupon created", data: coupon });
  },
);

export const getAllCoupons = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupons = await CouponService.getAllCoupons(req.query);
    res
      .status(200)
      .json({ status: "success", total: coupons.length, data: coupons });
  },
);

export const getCouponById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupon = req.targetCoupon!;

    res.status(200).json({ status: "success", data: coupon });
  },
);

export const updateCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const couponId = req.targetCoupon!._id;

    const updated = await CouponService.updateCoupon(couponId, req.body);

    res
      .status(200)
      .json({ status: "success", message: "Coupon updated", data: updated });
  },
);

export const toggleCouponStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const couponId = req.targetCoupon!._id;

    const coupon = await CouponService.toggleCouponStatus(couponId);

    res.status(200).json({
      status: "success",
      message: `Coupon is now ${coupon.status}`,
      data: coupon,
    });
  },
);

export const deleteCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const couponId = req.targetCoupon!._id;

    await CouponService.deleteCoupon(couponId);
    res.status(200).json({ status: "success", message: "Coupon deleted" });
  },
);

export const validateCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.code) {
      throw new AppError("Invalid code", 400);
    }

    const coupon = await CouponService.validateCoupon(req.body.code);
    res
      .status(200)
      .json({ status: "success", message: "Coupon valid", data: coupon });
  },
);

export const applyCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CouponService.applyCoupon(req.body);
    res
      .status(200)
      .json({ status: "success", message: "Coupon applied", data: result });
  },
);
