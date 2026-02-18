import mongoose, { Types } from "mongoose";

// Repository
import { ProductRepository } from "../Repositories/product.repository.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";
import { buildProductFilterQuery } from "../Utils/apiFeatures/ProductFilters.ts";
import { normalizeVariants } from "../Utils/productManagement.ts";
import { isValidObjectId } from "../Utils/mongoose.management.ts";
import AppError from "../Utils/AppError.ts";

// Types
import type { CreateProductInput } from "../types/product.types.ts";

export const ProductService = {
  async getAll(reqQuery: any) {
    let query = ProductRepository.findAll({});

    // await the async filter
    const filters = await buildProductFilterQuery({
      colors: reqQuery.colors?.split(",") || [],
      sizes: reqQuery.sizes?.split(",") || [],
      categories: reqQuery.categories?.split(",") || [],
      tags: reqQuery.tags?.split(",") || [],
      minPrice: reqQuery.minPrice ? Number(reqQuery.minPrice) : undefined,
      maxPrice: reqQuery.maxPrice ? Number(reqQuery.maxPrice) : undefined,
    });

    const features = new ApiFeatures(query, reqQuery)
      .filter()
      .search(["name", "slug", "tags", "variants.color"]);

    // ✅ APPLY PRODUCT FILTERS FIRST
    features.query = features.query.find(filters);

    // ✅ THEN SORT, LIMIT, PAGINATE
    features.sort().limitFields();
    await features.paginate(10);

    return {
      data: await features.query,
      meta: features.meta,
    };
  },

  async getFeatured(reqQuery: any) {
    let query = ProductRepository.findFeatured({});

    const features = new ApiFeatures(query, reqQuery)
      .filter()
      .sort()
      .limitFields();

    await features.paginate();

    return {
      data: await features.query,
      meta: features.meta,
    };
  },

  async getById(productId: Types.ObjectId) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    return product;
  },

  async getSuggestions(rawQuery: string) {
    const query = rawQuery.trim();

    if (!query || query.length < 2) {
      throw new AppError("Query too short", 400);
    }

    // Split words for multi-keyword search
    const words = query.split(" ").filter(Boolean);

    const regexes = words.map((word) => new RegExp(word, "i"));

    const searchQuery = {
      $and: regexes.map((r) => ({
        $or: [{ name: r }, { "variants.color": r }, { tags: r }],
      })),
    };

    return ProductRepository.findAutoSuggestions(searchQuery, 10);
  },

  async create(data: CreateProductInput, creatorId: Types.ObjectId) {
    if (await ProductRepository.findBySlug(data.slug)) {
      throw new AppError("Slug already exists", 400);
    }

    if (data.baseCostPrice > data.baseSellingPrice) {
      throw new AppError("Base cost price cannot exceed selling price", 400);
    }

    const uniqueCategories = [...new Set(data.categories)];

    const categories = uniqueCategories.map((id) => {
      if (!isValidObjectId(id)) {
        throw new AppError(`Invalid category id: ${id}`, 400);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const variants = normalizeVariants(
      data.variants ?? [],
      data.baseCostPrice,
      data.baseSellingPrice,
    );

    return ProductRepository.create({
      ...data,
      variants,
      categories,
      createdBy: creatorId,
    });
  },

  async update(productId: Types.ObjectId, updates: any) {
    if (updates.slug) {
      const existing = await ProductRepository.findBySlug(updates.slug);
      if (existing && existing._id.toString() !== productId.toString()) {
        throw new AppError("Slug already exists", 400);
      }
    }

    const updated = await ProductRepository.updateById(productId, updates);
    if (!updated) throw new AppError("Product not found", 404);

    return updated;
  },

  async toggleActive(productId: Types.ObjectId) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    product.isActive = !product.isActive;
    await product.save();

    return product.isActive;
  },

  async toggleFeatured(productId: Types.ObjectId) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    product.featured = !product.featured;
    await product.save();

    return product.featured;
  },

  async delete(productId: Types.ObjectId) {
    const deleted = await ProductRepository.deleteById(productId);
    if (!deleted) throw new AppError("Product not found", 404);
  },

  async decrementStock(
    productId: Types.ObjectId,
    color: string,
    size: string,
    qty: number,
    session?: any,
  ) {
    const res = await ProductRepository.decrementStock(
      productId,
      color,
      size,
      qty,
      session,
    );

    const modified = (res as any).modifiedCount ?? (res as any).nModified ?? 0;

    if (!modified) {
      throw new AppError("Insufficient stock", 400);
    }
  },

  async restoreStock(
    productId: Types.ObjectId,
    color: string,
    size: string,
    qty: number,
    session?: any,
  ) {
    await ProductRepository.restoreStock(productId, color, size, qty, session);
  },
};
