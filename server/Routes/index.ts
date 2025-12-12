import express from "express";

// Routes
import authRouter from "./auth.route.ts";
import userRouter from "./user.route.ts";
import productRouter from "./product.route.ts";
import categoryRouter from "./category.route.ts";
import slugRouter from "./slug.route.ts";
import couponRouter from "./coupon.route.ts";
import orderRouter from "./order.route.ts";
import referralRouter from "./referral.route.ts";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/slugs", slugRouter);
router.use("/coupons", couponRouter);
router.use("/orders", orderRouter);
router.use("/referrals", referralRouter);

export default router;
