import express from "express";

// Controllers
import {
  getMyLedger,
  getMyLedgerSummary,
  getUserLedger,
} from "./../Controllers/ledger.controller.ts";

// Middlewares
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { userIdParamHandler } from "../Middleware/param.middleware.ts";

const router = express.Router();

router.param("userId", userIdParamHandler);

router.get("/me", protect, getMyLedger);
router.get("/me/summary", protect, getMyLedgerSummary);

// Admin
router.get("/:userId", protect, authorize("admin"), getUserLedger);

export default router;
