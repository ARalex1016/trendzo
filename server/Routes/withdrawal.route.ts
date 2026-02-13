import express from "express";

// Controllers
import {
  requestWithdrawal,
  getMyWithdrawals,
  getWithdrawalById,
  // getPendingWithdrawals,
  updateStatus,
} from "./../Controllers/withdrawal.controller.ts";

// Middlewares
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { withdrawalIdParamHandler } from "../Middleware/param.middleware.ts";

const router = express.Router();

router.param("withdrawalId", withdrawalIdParamHandler);

router.post("/", protect, requestWithdrawal);
router.get("/me", protect, getMyWithdrawals);
router.get("/:withdrawalId", protect, getWithdrawalById);
// router.get("/pending", protect, authorize("admin"), getPendingWithdrawals);

// Admin

router.post(
  "/approve/:withdrawalId",
  protect,
  authorize("admin"),
  updateStatus
);

export default router;
