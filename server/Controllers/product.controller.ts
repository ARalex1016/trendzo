import type { Request, Response } from "express";

// Services
import { ProductService } from "../Services/product.service.ts";

export const getAllProducts = async (req: Request, res: Response) => {
  const result = await ProductService.getAll(req.query);

  res.status(200).json({
    status: "success",
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  const result = await ProductService.getFeatured(req.query);

  res.status(200).json({
    status: "success",
    data: result.data,
    meta: result.meta,
  });
};

export const getProduct = async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: req.targetProduct,
  });
};

export const getAutoSuggestions = async (req: Request, res: Response) => {
  const q = req.query.q;

  const suggestions = await ProductService.getSuggestions(String(q ?? ""));

  res.status(200).json({
    status: "success",
    data: suggestions,
  });
};

export const addProduct = async (req: Request, res: Response) => {
  const product = await ProductService.create(req.body, req.user!._id);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const updated = await ProductService.update(req.targetProduct!._id, req.body);

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updated,
  });
};

export const toggleFeatured = async (req: Request, res: Response) => {
  const isFeatured = await ProductService.toggleFeatured(
    req.targetProduct!._id
  );

  res.status(200).json({
    status: "success",
    message: `Product is now ${isFeatured ? "Featured" : "Not Featured"}`,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await ProductService.delete(req.targetProduct!._id);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
};
