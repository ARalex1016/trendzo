import express from "express";

// Routes
import authRouter from "./auth.route.ts";
import userRouter from "./user.route.ts";
import attributeRouter from "./attribute.route.ts";
import paymentMethodRouter from "./payment-method.route.ts";
import productRouter from "./product.route.ts";
import categoryRouter from "./category.route.ts";
import sizeRouter from "./size.route.ts";
import colorRouter from "./color.route.ts";
import slugRouter from "./slug.route.ts";
import couponRouter from "./coupon.route.ts";
import orderRouter from "./order.route.ts";
import referralRouter from "./referral.route.ts";
import ledgerRouter from "./ledger.route.ts";
import withdrawalRouter from "./withdrawal.route.ts";
import reviewRouter from "./review.route.ts";

const router = express.Router();

router.use("/v1/auth", authRouter);
router.use("/v1/users", userRouter);
router.use("/v1/attributes", attributeRouter);
router.use("/v1/payment-methods", paymentMethodRouter);
router.use("/v1/products", productRouter);
router.use("/v1/categories", categoryRouter);
router.use("/v1/sizes", sizeRouter);
router.use("/v1/colors", colorRouter);
router.use("/v1/slugs", slugRouter);
router.use("/v1/coupons", couponRouter);
router.use("/v1/orders", orderRouter);
router.use("/v1/referrals", referralRouter);
router.use("/v1/ledgers", ledgerRouter);
router.use("/v1/withdrawals", withdrawalRouter);
router.use("/v1/reviews", reviewRouter);

export default router;
