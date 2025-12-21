import express from "express";

// Controllers
import {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  markOrderDelivered,
  updateOrderStatus,
} from "../Controllers/order.controller.ts";

// Middlrewares
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { validateRequest } from "../Middleware/validateRequest.middleware.ts";
import { orderIdParamHandler } from "../Middleware/param.middleware.ts";

// Validation Schemas
import { placeOrderSchema } from "../Validations/order.validators.ts";

const router = express.Router();

router.param("orderId", orderIdParamHandler);

// USER ROUTES
router.post(
  "/",
  protect,
  authorize("user"),
  validateRequest(placeOrderSchema),
  placeOrder
);
router.get("/my-orders", protect, authorize("user"), getMyOrders);
router.get(
  "/:orderId",
  protect,
  authorize("user", "operator", "admin"),
  getSingleOrder
);
router.patch("/cancel/:orderId", protect, authorize("user"), cancelOrder);

// ADMIN / OPERATOR ROUTES
router.get("/", protect, authorize("operator", "admin"), getAllOrders);
router.patch(
  "/:orderId/deliver",
  protect,
  authorize("admin"),
  markOrderDelivered
);
router.patch(
  "/status/:orderId",
  protect,
  authorize("operator", "admin"),
  updateOrderStatus
);

export default router;
