import express from "express";

// Controllers
import {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../Controllers/order.controller.ts";

// Middlrewares
import { protect, authorize } from "../Controllers/auth.controller.ts";

const router = express.Router();

// USER ROUTES
router.post("/", protect, authorize("user"), placeOrder);
router.get("/my-orders", protect, authorize("user"), getMyOrders);
router.get("/:orderId", protect, authorize("user"), getSingleOrder);
router.put("/cancel/:orderId", protect, authorize("user"), cancelOrder);

// ADMIN / OPERATOR ROUTES
router.get("/", protect, authorize("admin", "operator"), getAllOrders);
router.put(
  "/status/:orderId",
  protect,
  authorize("admin", "operator"),
  updateOrderStatus
);

export default router;
