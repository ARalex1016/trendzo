import type { Request, Response, NextFunction } from "express";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";
import AppError from "../Utils/AppError.ts";

// Service
import CategoryService from "../Services/category.service.ts";

// Models
import type { ICategory } from "../Models/category.model.ts";

export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getAll(
      req.query as Record<string, unknown>
    );
    res.status(200).json({
      status: "success",
      message: "",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      slug,
      metaTitle,
      metaDescription,
      parentCategory,
    } = req.body;

    // Ensure req.user exists (middleware protect should set it)
    const createdBy = (req as any).user?._id;
    if (!createdBy) throw new AppError("Unauthorized: user missing", 401);

    const category = await CategoryService.create({
      name,
      description,
      slug,
      metaTitle,
      metaDescription,
      parentCategory,
      createdBy,
    });

    res.status(201).json({
      status: "success",
      message: "Category created successfully.",
      data: category,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const targetCategory = (req as any).targetCategory as ICategory;
    if (!targetCategory) throw new AppError("Target category not loaded", 500);

    const updated = await CategoryService.update(targetCategory, req.body);
    res.status(200).json({
      status: "success",
      message: "Category updated successfully.",
      data: updated,
    });
  }
);

export const toggleCategoryStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const targetCategory = (req as any).targetCategory as ICategory;
    if (!targetCategory) throw new AppError("Target category not loaded", 500);

    const toggled = await CategoryService.toggleStatus(targetCategory);
    res.status(200).json({
      status: "success",
      message: `Category has been ${
        toggled.isActive ? "enabled" : "disabled"
      } successfully.`,
      data: toggled,
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const targetCategory = (req as any).targetCategory as ICategory;
    if (!targetCategory) throw new AppError("Target category not loaded", 500);

    await CategoryService.remove(targetCategory);
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  }
);
