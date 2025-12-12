import express from "express";

// Controllers
import {
  validateCoupon,
  applyCoupon,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
} from "../Controllers/coupon.controller.ts";

// Middlewares
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { couponIdParamHandler } from "../Middleware/param.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

// Validation Schemas
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponParamsSchema,
  applyCouponBodySchema,
} from "../Validations/coupon.validator.ts";

const router = express.Router();

router.param("couponId", couponIdParamHandler);

// Apply coupon
router.get(
  "/validate",
  protect,
  validateRequest(validateCouponParamsSchema),
  validateCoupon
);
router.post(
  "/apply",
  protect,
  authorize("user"),
  validateRequest(applyCouponBodySchema),
  applyCoupon
);

// Admin
router.get("/", protect, authorize("admin"), getAllCoupons);
router.get("/:couponId", protect, authorize("admin"), getCouponById);
router.post(
  "/",
  protect,
  authorize("admin"),
  validateRequest(createCouponSchema),
  createCoupon
);
router.patch(
  "/:couponId",
  protect,
  authorize("admin"),
  validateRequest(updateCouponSchema),
  updateCoupon
);
router.patch(
  "/:couponId/status",
  protect,
  authorize("admin"),
  toggleCouponStatus
);
router.delete("/:couponId", protect, authorize("admin"), deleteCoupon);

export default router;
