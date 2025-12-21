import express from "express";

// Controllers
import {
  getMyPaymentMethods,
  getPaymentMethodById,
  addPaymentMethod,
  updatePaymentMethodById,
  setDefault,
  deletePaymentMethodById,
  getAllPaymentMethods,
} from "../Controllers/payment-method.controller.ts";

// Middlewares
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { paymentMethodIdParamHandler } from "../Middleware/param.middleware.ts";

const router = express.Router();

// Param Middleware
router.param("paymentMethodId", paymentMethodIdParamHandler);

// User
router.get("/", protect, getMyPaymentMethods);
router.get("/:paymentMethodId", protect, getPaymentMethodById);
router.post("/", protect, addPaymentMethod);
router.patch("/:paymentMethodId", protect, updatePaymentMethodById);
router.patch("/:paymentMethodId", protect, setDefault);
router.delete("/:paymentMethodId", protect, deletePaymentMethodById);

// Admin
router.get("/admin", protect, authorize("admin"), getAllPaymentMethods);

export default router;
