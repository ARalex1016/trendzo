import type { Request, Response, NextFunction } from "express";

// Services
import { CouponService } from "../Services/coupon1.service.ts";

// Utils
import AppError from "../Utils/AppError.ts";

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupon = await CouponService.createCoupon(req.body, req.user!._id);
    res
      .status(201)
      .json({ status: "success", message: "Coupon created", data: coupon });
  } catch (err) {
    next(err);
  }
};

export const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupons = await CouponService.getAllCoupons(req.query);
    res
      .status(200)
      .json({ status: "success", total: coupons.length, data: coupons });
  } catch (err) {
    next(err);
  }
};

export const getCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupon = req.targetCoupon!;

    res.status(200).json({ status: "success", data: coupon });
  } catch (err) {
    next(err);
  }
};

export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = req.targetCoupon!._id;

    const updated = await CouponService.updateCoupon(couponId, req.body);

    res
      .status(200)
      .json({ status: "success", message: "Coupon updated", data: updated });
  } catch (err) {
    next(err);
  }
};

export const toggleCouponStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = req.targetCoupon!._id;

    const coupon = await CouponService.toggleCouponStatus(couponId);

    res.status(200).json({
      status: "success",
      message: `Coupon is now ${coupon.status}`,
      data: coupon,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = req.targetCoupon!._id;

    await CouponService.deleteCoupon(couponId);
    res.status(200).json({ status: "success", message: "Coupon deleted" });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.code) {
      throw new AppError("Invalid code", 400);
    }

    const coupon = await CouponService.validateCoupon(req.body.code);
    res
      .status(200)
      .json({ status: "success", message: "Coupon valid", data: coupon });
  } catch (err) {
    next(err);
  }
};

export const applyCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CouponService.applyCoupon(req.body);
    res
      .status(200)
      .json({ status: "success", message: "Coupon applied", data: result });
  } catch (err) {
    next(err);
  }
};
