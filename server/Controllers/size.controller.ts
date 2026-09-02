// Types
import type { Request, Response, NextFunction } from "express";

// Service
import SizeService from "../Services/size.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const createSize = asyncHandler(async (req: Request, res: Response) => {
  const size = await SizeService.createSize(req.body);

  res.status(201).json({
    status: "success",
    message: "Size created successfully",
    data: size,
  });
});

export const getSize = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Size retrieved successfully",
    data: req.targetSize,
  });
});

export const updateSize = asyncHandler(async (req: Request, res: Response) => {
  const updated = await SizeService.updateSize(req.targetSize!._id, req.body);

  res.status(200).json({
    status: "success",
    message: "Size updated successfully",
    data: updated,
  });
});

export const deleteSize = asyncHandler(async (req: Request, res: Response) => {
  await SizeService.deleteSize(req.targetSize!._id);

  res.status(200).json({
    status: "success",
    message: "Size deleted successfully",
    data: null,
  });
});

export const listSizes = asyncHandler(async (req: Request, res: Response) => {
  const sizes = await SizeService.listSizes();

  res.status(200).json({
    status: "success",
    message: "Sizes retrieved successfully",
    data: sizes,
  });
});
