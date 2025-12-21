import type { Request, Response } from "express";

// Services
import { LedgerService } from "../Services/ledger.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const getMyLedger = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;

  const data = await LedgerService.getUserLedger(user._id);

  // Success
  res.status(200).json({
    status: "success",
    data,
  });
});

export const getMyLedgerSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const data = await LedgerService.getUserLedger(user._id);

    // Success
    res.status(200).json({
      status: "success",
      data,
    });
  }
);

export const getUserLedger = asyncHandler(
  async (req: Request, res: Response) => {
    const targetUser = req.targetUser!;

    const data = await LedgerService.getUserLedger(targetUser._id);

    // Success
    res.status(200).json({
      status: "success",
      data,
    });
  }
);
