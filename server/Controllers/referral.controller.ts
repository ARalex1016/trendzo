import mongoose from "mongoose";
import type { Request, Response } from "express";

// Services
import { ReferralService } from "../Services/referral.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const getMyReferrals = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const referrals = await ReferralService.getMyReferrals(user._id);

    // Success
    res.status(200).json({
      status: "success",
      data: referrals,
    });
  }
);

export const getReferralEarnings = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const earnings = await ReferralService.getReferralEarnings(user._id);

    // Success
    res.status(200).json({
      status: "success",
      data: { earnings },
    });
  }
);

export const getAllReferrals = asyncHandler(
  async (req: Request, res: Response) => {
    const referrals = await ReferralService.getAllReferrals();

    // Success
    res.status(200).json({
      status: "success",
      data: referrals,
    });
  }
);

export const rewardReferral = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.targetUser!;

    const updatedReferral = await ReferralService.rewardReferral(user._id);

    // Success
    res.status(200).json({
      status: "success",
      date: updatedReferral,
    });
  }
);
