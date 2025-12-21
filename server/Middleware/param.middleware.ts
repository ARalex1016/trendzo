import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";

// Utils
import { isValidObjectId } from "../Utils/mongoose.management.ts";

// Models
import User from "../Models/user.model.ts";
import PaymentMethod from "../Models/payment-method.model.ts";
import Product from "../Models/product.model.ts";
import Category from "../Models/category.model.ts";
import Coupon from "../Models/coupon.model.ts";
import Order from "../Models/order.model.ts";
import Withdrawal from "../Models/withdraw.model.ts";
import Review from "../Models/review.model.ts";

export const userIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    req.targetUser = user;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const paymentMethodIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentMethodId } = req.params;

    // Validate ObjectId
    if (!paymentMethodId || !isValidObjectId(paymentMethodId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid payment ID",
      });
    }

    const paymentMethod = await PaymentMethod.findById(paymentMethodId);

    if (!paymentMethod) {
      return res.status(404).json({
        status: "fail",
        message: "Payment method not found",
      });
    }

    req.targetPaymentMethod = paymentMethod;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const productSlugParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: "fail",
        message: "Slug parameter is required",
      });
    }

    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    req.targetProduct = product;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const productIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId
    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID",
      });
    }

    console.log(productId);

    const product = await Product.findById(productId);

    console.log(product);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    req.targetProduct = product;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const categoryIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    // Validate ObjectId
    if (!categoryId || !isValidObjectId(categoryId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    req.targetCategory = category;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const couponIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { couponId } = req.params;

    // Validate ObjectId
    if (!couponId || !isValidObjectId(couponId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid coupon ID",
      });
    }

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        status: "fail",
        message: "Coupon not found",
      });
    }

    req.targetCoupon = coupon;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const orderIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    // Validate ObjectId
    if (!orderId || !isValidObjectId(orderId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    req.targetOrder = order;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const withdrawalIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { withdrawalId } = req.params;

    // Validate ObjectId
    if (!withdrawalId || !isValidObjectId(withdrawalId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid withdrawal ID",
      });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({
        status: "fail",
        message: "Withdarwal not found",
      });
    }

    req.targetWithdrawal = withdrawal;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const reviewIdParamHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;

    // Validate ObjectId
    if (!reviewId || !isValidObjectId(reviewId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }

    req.targetReview = review;
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
