import type { Request, Response } from "express";

// Services
import ProductService from "../Services/product.service.ts";
import SizeService from "../Services/size.service.ts";
import ColorService from "../Services/color.service.ts";

// Utils
import { asyncHandler } from "../Utils/asyncHandler.ts";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await ProductService.getAll(req.query);

    res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await ProductService.getFeatured(req.query);

    res.status(200).json({
      status: "success",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = req.targetProduct!;

  const sizes = await Promise.all(
    product?.sizes.map((sizeId) => SizeService.getSizeById(sizeId)),
  );

  const colors = await Promise.all(
    product?.colors.map((colorId) => ColorService.getColorById(colorId)),
  );

  res.status(200).json({
    status: "success",
    data: { ...product.toObject(), sizes, colors },
  });
});

export const getAutoSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const query = String(req.query.q ?? "").trim();

    if (!query || query.length < 1) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    const suggestions = await ProductService.getSuggestions(query, 10);

    res.status(200).json({
      status: "success",
      data: suggestions,
    });
  },
);

export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.create(req.body, req.user!._id);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await ProductService.update(
      req.targetProduct!._id,
      req.body,
    );

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updated,
    });
  },
);

export const toggleActive = asyncHandler(
  async (req: Request, res: Response) => {
    const isActive = await ProductService.toggleActive(req.targetProduct!._id);

    res.status(200).json({
      status: "success",
      message: `Product is now ${isActive ? "Activated" : "Deactiavted"}`,
    });
  },
);

export const toggleFeatured = asyncHandler(
  async (req: Request, res: Response) => {
    const featured = await ProductService.toggleFeatured(
      req.targetProduct!._id,
    );

    res.status(200).json({
      status: "success",
      message: `Product is now ${featured ? "Featured" : "Not Featured"}`,
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    await ProductService.delete(req.targetProduct!._id);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  },
);
