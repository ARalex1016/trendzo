import express from "express";

// Controllers
import {
  placeOrder,
  placeStoreOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
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
  "/orderNumber/:orderNumber",
  protect,
  authorize("customer", "operator", "admin"),
  getSingleOrder,
); // getOrderByOrderNumber

router.patch("/cancel/:orderId", protect, authorize("customer"), cancelOrder);

// ADMIN / OPERATOR ROUTES
router.get("/", protect, authorize("operator", "admin"), getAllOrders);
router.post(
  "/in-store",
  protect,
  authorize("operator", "admin"),
  validateRequest(placeStoreOrderSchema),
  placeStoreOrder,
);
router.patch(
  "/:orderId/deliver",
  protect,
  authorize("admin"),
  markOrderDelivered,
);
router.patch(
  "/status/:orderId",
  protect,
  authorize("operator", "admin"),
  updateOrderStatus,
);

export default router;
