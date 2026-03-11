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
    data: size,
  });
});

export const getSize = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: req.targetSize,
  });
});

export const updateSize = asyncHandler(async (req: Request, res: Response) => {
  const updated = await SizeService.updateSize(req.targetSize!._id, req.body);

  res.status(200).json({
    status: "success",
    data: updated,
  });
});

export const deleteSize = asyncHandler(async (req: Request, res: Response) => {
  await SizeService.deleteSize(req.targetSize!._id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const listSizes = asyncHandler(async (req: Request, res: Response) => {
  const sizes = await SizeService.listSizes();

  res.status(200).json({
    status: "success",
    data: sizes,
  });
});
