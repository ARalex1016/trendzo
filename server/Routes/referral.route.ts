import express from "express";
const router = express.Router();

// Controllers
import {
  getMyReferrals,
  getReferralEarnings,
  getAllReferrals,
  rewardReferral,
} from "../Controllers/referral.controller.ts";

// Middleware
import { protect, authorize } from "../Controllers/auth.controller.ts";
import { userIdParamHandler } from "../Middleware/param.middleware.ts";

router.param("userId", userIdParamHandler);

// Referral details for current user
router.get("/my-referrals", protect, getMyReferrals);
router.get("/earnings", protect, getReferralEarnings);

// Admin
router.get("/", protect, authorize("admin"), getAllReferrals);
router.post("/reward/:userId", protect, authorize("admin"), rewardReferral);

export default router;
