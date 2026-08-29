import express from "express";

// Controllers
import {
  placeOrder,
  placeStoreOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  verifyOrderPaymentController,
  confirmOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  returnOrder,
  refundOrder,
  updateOrderStatus,
} from "../Controllers/order.controller.ts";

// Middlrewares
import { protect, authorize } from "../Middleware/auth.middleware.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";
import {
  orderIdParamHandler,
  orderNumberParamHandler,
} from "../Middleware/param.middleware.ts";

// Validation Schemas
import {
  placeOrderSchema,
  placeStoreOrderSchema,
  verifyManualPaymentSchema,
} from "../Validations/order.validators.ts";

const router = express.Router();

router.param("orderId", orderIdParamHandler);
router.param("orderNumber", orderNumberParamHandler);

// USER ROUTES
router.post(
  "/",
  protect,
  authorize("customer"),
  validateRequest(placeOrderSchema),
  placeOrder,
);

router.get("/my-orders", protect, authorize("customer"), getMyOrders);

router.get(
  "/:orderId",
  protect,
  authorize("customer", "operator", "admin"),
  getSingleOrder,
); // getOrderById

router.get(
  "/by-number/:orderNumber",
  protect,
  authorize("customer", "operator", "admin"),
  getSingleOrder,
); // getOrderByOrderNumber

// router.patch("/cancel/:orderId", protect, authorize("customer"), cancelOrder);

// ADMIN / OPERATOR ROUTES
router.get("/", protect, authorize("operator", "admin"), getAllOrders);

// In-store order
router.post(
  "/in-store",
  protect,
  authorize("operator", "admin"),
  validateRequest(placeStoreOrderSchema),
  placeStoreOrder,
);

// Verify Manual Payment
router.patch(
  "/:orderNumber/payment/verify",
  protect,
  authorize("operator", "admin"),
  validateRequest(verifyManualPaymentSchema),
  verifyOrderPaymentController,
);

router.patch(
  "/:orderNumber/confirm",
  protect,
  authorize("operator", "admin"),
  confirmOrder,
);

router.patch(
  "/:orderNumber/ship",
  protect,
  authorize("operator", "admin"),
  shipOrder,
);

router.patch(
  "/:orderNumber/deliver",
  protect,
  authorize("admin", "operator"),
  deliverOrder,
);

router.patch(
  "/:orderNumber/cancel",
  protect,
  authorize("admin", "operator"),
  cancelOrder,
);

router.patch(
  "/:orderNumber/return",
  protect,
  authorize("admin", "operator"),
  returnOrder,
);

router.patch(
  "/:orderNumber/refund",
  protect,
  authorize("admin", "operator"),
  refundOrder,
);

router.patch(
  "/status/:orderId",
  protect,
  authorize("admin", "operator"),
  updateOrderStatus,
);

export default router;
