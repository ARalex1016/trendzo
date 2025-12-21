import type { Request, Response } from "express";

// Services
import { WithdrawalService } from "../Services/withdrawal.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const requestWithdrawal = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const { amount, method } = req.body;

    const withdrawal = await WithdrawalService.requestWithdrawal(
      user._id,
      amount,
      method
    );

    // Success
    res.status(201).json({
      status: "success",
      data: withdrawal,
    });
  }
);

export const getMyWithdrawals = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const data = await WithdrawalService.getMyWithdrawals(user._id);

    // Success
    res.status(200).json({
      status: "success",
      data,
    });
  }
);

export const getWithdrawalById = asyncHandler(
  async (req: Request, res: Response) => {
    const targetWithdrawal = req.targetWithdrawal!;

    const data = await WithdrawalService.getWithdrawal(targetWithdrawal._id);

    // Success
    res.status(200).json({
      status: "success",
      data,
    });
  }
);

export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const targetWithdrawal = req.targetWithdrawal!;
    const { success, referenceId } = req.body;

    await WithdrawalService.completeWithdrawal(
      targetWithdrawal._id,
      success,
      referenceId
    );

    // Success
    res.status(200).json({
      status: "success",
      message: "Withdrawal updated",
    });
  }
);
