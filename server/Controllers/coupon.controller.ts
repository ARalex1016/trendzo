import { Types } from "mongoose";
import type { Request, Response } from "express";

// Models
import Coupon from "../Models/coupon.model.ts";

// Utils
import { capitalizeString } from "../Utils/stringManager.ts";

/* ============================
   REUSABLE: Check if coupon code exists
============================ */
const isCouponCodeTaken = async (
  code: string,
  excludeId?: string | Types.ObjectId
) => {
  const query: any = { code };

  if (excludeId) query._id = { $ne: excludeId };

  const existing = await Coupon.findOne(query);
  return !!existing;
};

// Apply coupon
export const validateCoupon = async (req: Request, res: Response) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({
      status: "fail",
      message: "Coupon code is required",
    });
  }

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid coupon code",
      });
    }

    if (coupon.status !== "active") {
      return res.status(400).json({
        status: "fail",
        message: "Coupon is inactive",
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        status: "fail",
        message: "Coupon has expired",
      });
    }

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Coupon is valid",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const applyCoupon = async (req: Request, res: Response) => {
  console.log(1);

  const { code, totalAmount, isReferredUser, isFirstTimeUser } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid coupon code",
      });
    }

    if (coupon.status !== "active") {
      return res.status(400).json({
        status: "fail",
        message: "Coupon is inactive",
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        status: "fail",
        message: "Coupon has expired",
      });
    }

    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
      return res.status(400).json({
        status: "fail",
        message: `Minimum purchase should be NPR ${coupon.minPurchase} to apply this coupon`,
      });
    }

    if (coupon.applicableUsers === "firstTime" && !isFirstTimeUser) {
      return res.status(403).json({
        status: "fail",
        message: "Coupon only for first-time users",
      });
    }

    if (coupon.applicableUsers === "referred" && !isReferredUser) {
      return res.status(403).json({
        status: "fail",
        message: "Coupon only for referred users",
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        status: "fail",
        message: "Coupon usage limit reached",
      });
    }

    /* Calculate final discount */
    let discount = 0;

    if (coupon.type === "percentage") {
      discount = (totalAmount * coupon.value) / 100;

      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    const finalAmount = totalAmount - discount;

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      data: {
        discount,
        finalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Admin
export const createCoupon = async (req: Request, res: Response) => {
  const { code } = req.body;
  const creator = req.user!;

  try {
    // Check duplicate
    if (await isCouponCodeTaken(code)) {
      return res.status(400).json({
        status: "fail",
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      ...req.body,
      code: capitalizeString(code),
      createdBy: creator._id,
    });

    // Success logic here
    res.status(201).json({
      status: "success",
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;

    const filter: any = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "All coupons retrieved successfully",
      total: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getCouponById = async (req: Request, res: Response) => {
  const coupon = req.targetCoupon!;
  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  const coupon = req.targetCoupon!;
  const updates = req.body;

  try {
    // Check duplicate code only if code is being updated
    if (updates.code) {
      updates.code = capitalizeString(updates.code);

      if (await isCouponCodeTaken(updates.code, coupon._id)) {
        return res.status(400).json({
          status: "fail",
          message: "Coupon code already exists",
        });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(coupon._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({
        status: "fail",
        message: "Coupon not found",
      });
    }

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Coupon updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const toggleCouponStatus = async (req: Request, res: Response) => {
  const coupon = req.targetCoupon!;
  try {
    coupon.status = coupon.status === "active" ? "inactive" : "active";
    await coupon.save();

    // Success logic here
    res.status(200).json({
      status: "success",
      message: `Coupon is now ${coupon.status}`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  const coupon = req.targetCoupon!;

  try {
    await Coupon.findByIdAndDelete(coupon._id);

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
