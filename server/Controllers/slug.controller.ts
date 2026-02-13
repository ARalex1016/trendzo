import type { Request, Response, NextFunction } from "express";

// Models
import Product from "../Models/product.model.ts";
import Category from "../Models/category.model.ts";

// Services
import { SlugService } from "../Services/slug.service.ts";

// Errors
import AppError from "../Utils/AppError.ts";

// Helpers
const resolveModel = (modelName: string) => {
  switch (modelName) {
    case "Product":
      return Product;
    case "Category":
      return Category;
    default:
      throw new AppError("Invalid model name", 400);
  }
};

export const suggestSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { model: modelName, field, value } = req.query;

    if (!modelName || !field || !value) {
      throw new AppError("Missing required query parameters", 400);
    }

    const model = resolveModel(modelName as string);

    const slugs = await SlugService.suggestSlugs(
      model,
      field as string,
      value as string
    );

    res.status(200).json({
      status: "success",
      data: slugs,
    });
  } catch (error) {
    next(error);
  }
};

export const checkSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { model: modelName, field, value } = req.query;

    if (!modelName || !field || !value) {
      throw new AppError("Missing required query parameters", 400);
    }

    const model = resolveModel(modelName as string);

    const available = await SlugService.checkAvailability(
      model,
      field as string,
      value as string
    );

    res.status(200).json({
      status: "success",
      data: { available },
    });
  } catch (error) {
    next(error);
  }
};
