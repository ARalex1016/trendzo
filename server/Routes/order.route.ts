import express from "express";

// Controllers
import {
  placeOrder,
  placeStoreOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  verifyManualPayment,
  confirmOrder,
  markOrderDelivered,
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

router.patch("/cancel/:orderId", protect, authorize("customer"), cancelOrder);

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
  "/:orderId/payment/verify",
  protect,
  authorize("operator", "admin"),
  validateRequest(verifyManualPaymentSchema),
  verifyManualPayment,
);

router.patch(
  "/:orderId/confirm",
  protect,
  authorize("operator", "admin"),
  confirmOrder,
);

router.patch(
  "/:orderId/deliver",
  protect,
  authorize("admin", "operator"),
  markOrderDelivered,
);

router.patch(
  "/status/:orderId",
  protect,
  authorize("admin", "operator"),
  updateOrderStatus,
);

// Refund
// router.patch(
//   "/:orderId/refund",
//   protect,
//   authorize("admin", "operator"),
//   refund,
// );

export default router;
