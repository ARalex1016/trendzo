import type { Request, Response } from "express";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    // Success
    res.status(200).json({
      status: "success",
      message: "",
    });
  }
);

export const getProductReviews = asyncHandler(
  async (req: Request, res: Response) => {
    // Success
    res.status(200).json({
      status: "success",
      message: "",
    });
  }
);

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    // Success
    res.status(200).json({
      status: "success",
      message: "",
    });
  }
);

export const updateReviewStatus = asyncHandler(
  async (req: Request, res: Response) => {
    // Success
    res.status(200).json({
      status: "success",
      message: "",
    });
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    // Success
    res.status(200).json({
      status: "success",
      message: "",
    });
  }
);
