import type { Request, Response } from "express";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import ColorService from "../Services/color.service.ts";

export const createColor = asyncHandler(async (req: Request, res: Response) => {
  const color = await ColorService.createColor(req.body);

  res.status(201).json({
    status: "success",
    data: color,
  });
});

export const getColors = asyncHandler(async (req: Request, res: Response) => {
  const colors = await ColorService.getAllColors();

  res.status(200).json({
    status: "success",
    results: colors.length,
    data: colors,
  });
});

export const getColor = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: req.targetColor,
  });
});

export const updateColor = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ColorService.updateColor(
    req.targetColor!._id,
    req.body,
  );

  res.status(200).json({
    status: "success",
    data: updated,
  });
});

export const deleteColor = asyncHandler(async (req: Request, res: Response) => {
  await ColorService.deleteColor(req.targetColor!._id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
