import express from "express";

// Middlewares
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { couponIdParamHandler } from "../Middleware/param.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";

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

// Validation Schemas
import { createCouponSchema } from "../Validations/coupon.validator.ts";

const router = express.Router();

router.param("couponId", couponIdParamHandler);

// Apply coupon
router.get("/validate/:code", protect, validateCoupon);
router.post("/apply", protect, authorize("user"), applyCoupon);

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
router.patch("/:couponId", protect, authorize("admin"), updateCoupon);
router.patch(
  "/:couponId/status",
  protect,
  authorize("admin"),
  toggleCouponStatus
);
router.delete("/:couponId", protect, authorize("admin"), deleteCoupon);

export default router;
