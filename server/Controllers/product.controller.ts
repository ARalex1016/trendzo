import type { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

// Models
import Product, { type IProduct } from "../Models/product.model.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";
import { buildProductFilterQuery } from "../Utils/apiFeatures/ProductFilters.ts";
import { normalizeVariants } from "../Utils/productManagement.ts";
import { isValidObjectId } from "../Utils/mongoose.management.ts";

// Public product routes
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let query = Product.find();

    // 1) Initialize ApiFeatures with query and req.query
    const apiFeatures = new ApiFeatures(query, req.query as any)
      .filter() // generic filtering (will NOT include sizes/colors etc. now)
      .search(["name", "slug", "tags"]) // optional: search fields
      .sort()
      .limitFields();

    // 2) Build product-specific nested filters and apply them
    const productFilters = buildProductFilterQuery({
      colors: req.query.colors ? (req.query.colors as string).split(",") : [],
      sizes: req.query.sizes ? (req.query.sizes as string).split(",") : [],
      categories: req.query.categories
        ? (req.query.categories as string).split(",")
        : [],
      tags: req.query.tags ? (req.query.tags as string).split(",") : [],
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    });

    // Merge productFilters into current query (ApiFeatures.query)
    apiFeatures.query = apiFeatures.query.find(productFilters);

    // 3) Pagination (after all filters applied)
    await apiFeatures.paginate(20);

    const products = await apiFeatures.query;

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Retrieved products successfully",
      meta: apiFeatures.meta,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    // Start with base query: only featured products
    let query = Product.find({ featured: true });

    // Apply ApiFeatures
    const features = new ApiFeatures(query, req.query)
      .filter() // additional filters if needed
      .sort() // sort by query or default
      .limitFields(); // select specific fields

    await features.paginate(); // pagination

    const featuredProducts = await features.query;

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Retrieved featured products successfully",
      meta: features.meta,
      data: featuredProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const targetProduct = req.targetProduct!;

  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Retrieved product successfully",
      data: targetProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAutoSuggestions = async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.trim();

  try {
    // Validation: query must exist and have minimum length
    if (!query || query.length < 2) {
      return res.status(400).json({
        status: "fail",
        message: "Query too short",
      });
    }

    // Normalize query for case-insensitive search
    const words = query.split(" ").filter(Boolean); // ["hand", "bag"]
    const regexes = words.map((word) => new RegExp(word, "i"));
    const searchQuery = {
      $and: regexes.map((r) => ({
        $or: [{ name: r }, { "variants.color": r }, { tags: r }],
      })),
    };

    // Fetch products: only return name & slug to reduce payload
    const suggestions = await Product.find(searchQuery, {
      name: 1,
      slug: 1,
      _id: 0,
    })
      .limit(10)
      .lean();

    // Success logic here
    res.status(200).json({
      status: "success",
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Admin product management
export const addProduct = async (req: Request, res: Response) => {
  // 1. Destructure input
  const {
    name,
    slug,
    description,
    specifications,
    basePrice,
    discount = 0,
    variants = [],
    categories = [],
    tags = [],
  } = req.body;

  // Ensure categories are strings
  const categoriesFromBody: string[] = categories;

  // 2. Remove duplicates first, still as strings
  const uniqueCategoriesStr: string[] = [...new Set(categoriesFromBody)];

  // 3. Validate each ObjectId
  for (const id of uniqueCategoriesStr) {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "fail",
        message: `Invalid category id: ${id}`,
      });
    }
  }

  // Convert to ObjectId after validation
  const uniqueCategories: Types.ObjectId[] = uniqueCategoriesStr.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  // 3. Normalize variants (size prices → color price → product price)
  const normalizedVariants = normalizeVariants(variants, basePrice);

  // 4. Create new Product
  const newProduct = await Product.create({
    name,
    slug,
    description,
    specifications,
    variants: normalizedVariants,
    basePrice,
    discount,
    categories: uniqueCategories,
    tags,
    createdBy: req.user!._id, // from protect middleware
  });

  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const targetProduct = req.targetProduct!;

  try {
    // Allowed fields for update
    const allowedUpdates: (keyof IProduct)[] = [
      "name",
      "slug",
      "description",
      "specifications",
      "variants",
      "basePrice",
      "discount",
      "categories",
      "tags",
      "featured",
    ];
    console.log(1);
    const updates: Partial<IProduct> = {};
    console.log(2);

    // Loop over request body and pick only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key as keyof IProduct)) {
        // @ts-ignore
        updates[key] = req.body[key];
      }
    });
    console.log(3);

    if (Object.keys(updates).length === 0) {
      console.log(4);
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided for update",
      });
    }
    console.log(5);

    if (updates.slug) {
      const existing = await Product.findOne({ slug: updates.slug });
      if (
        existing &&
        existing._id.toString() !== targetProduct._id.toString()
      ) {
        return res.status(400).json({
          status: "fail",
          message: "Slug already exists. Please use a unique slug.",
        });
      }
    }

    // Update product in DB
    const updatedProduct = await Product.findByIdAndUpdate(
      targetProduct._id,
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    );

    console.log(6);

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const toggleFeatured = async (req: Request, res: Response) => {
  const targetProduct = req.targetProduct!;

  targetProduct.featured = !targetProduct.featured;
  await targetProduct.save();

  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: `Product is now ${
        targetProduct.featured ? "Featured" : "Not Featured"
      }`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
