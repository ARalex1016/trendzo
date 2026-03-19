import type { Request, Response } from "express";

// Services
import SizeService from "../Services/size.service.ts";
import ColorService from "../Services/color.service.ts";
import CategoryService from "../Services/category.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const getAttributes = asyncHandler(
  async (req: Request, res: Response) => {
    const sizes = await SizeService.listSizes();
    const colors = await ColorService.getAllColors();
    const categories = await CategoryService.getAll(
      req.query as Record<string, unknown>,
    );

    res.status(200).json({
      status: "success",
      data: {
        sizes,
        colors,
        categories,
      },
    });
  },
);
