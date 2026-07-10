import type { Request, Response } from "express";

// Services
import ProductService from "../Services/product.service.ts";
import SizeService from "../Services/size.service.ts";
import ColorService from "../Services/color.service.ts";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../Services/cloudinary.service.ts";

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

// Product Only For Admin
export const getAllAdminProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await ProductService.getAllAdminProducts(req.query);

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
  let uploadedImages: {
    id: string;
    url: string;
    publicId: string;
  }[] = [];

  try {
    const files = req.files as Express.Multer.File[];

    const imageIds = Array.isArray(req.body.imageIds)
      ? req.body.imageIds
      : [req.body.imageIds];

    const productData = JSON.parse(req.body.product);

    if (!files?.length) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const result = await uploadToCloudinary(
          file.buffer,
          "trendzo/products",
        );

        return {
          id: imageIds[index],
          url: result.url,
          publicId: result.publicId,
        };
      }),
    );

    const thumbnailImage = uploadedImages.find(
      (img) => img.id === productData.thumbnail,
    );

    const productToSave = {
      ...productData,

      images: uploadedImages.map((img) => ({
        url: img.url,
        publicId: img.publicId,
      })),

      thumbnail: {
        url: thumbnailImage?.url,
        publicId: thumbnailImage?.publicId,
      },
    };

    const product = await ProductService.create(productToSave, req.user!._id);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // rollback
    await Promise.allSettled(
      uploadedImages.map((img) => deleteFromCloudinary(img.publicId)),
    );

    // let asyncHandler forward to global error handler
    throw error;
  }
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
      message: `${isActive ? "Product activated successfully" : "Product deactivated successfully"}`,
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
      message: `${featured ? "Added to featured products" : "Removed from featured products"}`,
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(1);

    await ProductService.delete(req.targetProduct!._id);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  },
);
