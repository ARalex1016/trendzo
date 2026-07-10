import mongoose, { Types } from "mongoose";

// Repository
import ProductRepository from "../Repositories/product.repository.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";
import { buildProductFilterQuery } from "../Utils/apiFeatures/ProductFilters.ts";
import { validateInventory } from "../Utils/validateInventory.ts";
import { isValidObjectId } from "../Utils/mongoose.management.ts";
import AppError from "../Utils/AppError.ts";

// Types
import type { CreateProductInput } from "../types/product.types.ts";
import type { IProduct, IInventory } from "../Models/product.model.ts";

const ProductService = {
  async getAll(reqQuery: any) {
    const fields =
      "_id name slug thumbnail baseSellingPrice discount categories tags isActive featured createdAt";

    let query = ProductRepository.findAll({ isActive: true }, fields);

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
      .search(["name", "slug", "tags"]);

    // ✅ APPLY PRODUCT FILTERS FIRST
    features.query = features.query.find(filters);

    // ✅ THEN SORT, LIMIT, PAGINATE
    features.sort().limitFields();
    await features.paginate(10);

    const data = await features.query;

    // Map thumbnail fallback
    const limitedData = data.map((p: any) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      thumbnail: p.thumbnail || null,
      baseSellingPrice: p.baseSellingPrice,
      discount: p.discount,
      categories: p.categories,
      tags: p.tags,
      isActive: p.isActive,
      featured: p.featured,
      createdAt: p.createdAt,
    }));

    return {
      data: limitedData,
      meta: features.meta,
    };
  },

  async getAllAdminProducts(reqQuery: any) {
    const fields =
      "_id name slug thumbnail images baseCostPrice baseSellingPrice discount categories tags inventory isActive featured createdBy createdAt updatedAt";

    let query = ProductRepository.findAll({}, fields);

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
      .search(["name", "slug", "tags"]);

    // ✅ APPLY PRODUCT FILTERS FIRST
    features.query = features.query.find(filters);

    // ✅ THEN SORT, LIMIT, PAGINATE
    features.sort().limitFields();
    await features.paginate(10);

    const data = await features.query;

    // Map thumbnail fallback
    const limitedData = data.map((p: IProduct) => {
      const stock = p.inventory.reduce(
        (sum, inventory) => sum + inventory.stock,
        0,
      );

      const variants = p.inventory.length;

      return {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        thumbnail: p.thumbnail || p.images[0] || null,
        baseCostPrice: p.baseCostPrice,
        baseSellingPrice: p.baseSellingPrice,
        discount: p.discount,
        categories: p.categories,
        stock,
        variants,
        tags: p.tags,
        featured: p.featured,
        isActive: p.isActive,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return {
      data: limitedData,
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

  async getSuggestions(rawQuery: string, limit = 10) {
    const query = rawQuery.trim();

    // Split words for multi-keyword search
    const words = query.split(" ").filter(Boolean);

    const regexes = words.map((word) => new RegExp(word, "i"));

    const searchQuery = {
      $and: regexes.map((r) => ({
        $or: [{ name: r }, { tags: r }],
      })),
    };

    return ProductRepository.findAutoSuggestions(searchQuery, limit);
  },

  async create(data: CreateProductInput, creatorId: Types.ObjectId) {
    if (await ProductRepository.findBySlug(data.slug)) {
      throw new AppError("Slug already exists", 400);
    }

    if (data.baseCostPrice > data.baseSellingPrice) {
      throw new AppError("Base cost price cannot exceed selling price", 400);
    }

    // Categories
    const uniqueCategories = [...new Set(data.categories)];

    const categories = uniqueCategories.map((id) => {
      if (!isValidObjectId(id)) {
        throw new AppError(`Invalid category id: ${id}`, 400);
      }
      return new mongoose.Types.ObjectId(id);
    });
    // Colors
    const uniqueColors = [...new Set(data.colors)];

    const colors = uniqueColors.map((id) => {
      if (!isValidObjectId(id)) {
        throw new AppError(`Invalid color id: ${id}`, 400);
      }

      return new mongoose.Types.ObjectId(id);
    });

    // Sizes
    const uniqueSizes = [...new Set(data.sizes)];

    const sizes = uniqueSizes.map((id) => {
      if (!isValidObjectId(id)) {
        throw new AppError(`Invalid size id: ${id}`, 400);
      }

      return new mongoose.Types.ObjectId(id);
    });

    // Inventory
    const inventory = validateInventory(
      data.colors,
      data.sizes,
      data.inventory,
    );

    return ProductRepository.create({
      name: data.name,
      slug: data.slug,
      description: data.description,

      images: data.images,
      thumbnail: data.thumbnail || data.images[0],

      baseCostPrice: data.baseCostPrice,
      baseSellingPrice: data.baseSellingPrice,
      discount: data.discount ?? 0,

      ...(data.specifications && { specifications: data.specifications }),

      colors,
      sizes,
      inventory,

      categories,
      tags: data.tags ?? [],

      featured: data.featured ?? false,
      isActive: data.isActive ?? true,

      createdBy: creatorId,
    });
  },

  async update(
    productId: Types.ObjectId,
    updates: Partial<CreateProductInput>,
  ) {
    const updateData: Partial<IProduct> = {};

    // Slug uniqueness check
    if (updates.slug) {
      const existing = await ProductRepository.findBySlug(updates.slug);

      if (existing && existing._id.toString() !== productId.toString()) {
        throw new AppError("Slug already exists", 400);
      }
      updateData.slug = updates.slug;
    }

    // Name
    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.images) updateData.images = updates.images;
    if (updates.baseCostPrice !== undefined)
      updateData.baseCostPrice = updates.baseCostPrice;
    if (updates.baseSellingPrice !== undefined)
      updateData.baseSellingPrice = updates.baseSellingPrice;
    if (updates.discount !== undefined) updateData.discount = updates.discount;
    if (updates.specifications)
      updateData.specifications = updates.specifications;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

    // Categories
    if (updates.categories) {
      const uniqueCategories = [...new Set(updates.categories)];
      updateData.categories = uniqueCategories.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
    }

    // Colors
    if (updates.colors) {
      const uniqueColors = [...new Set(updates.colors)];
      updateData.colors = uniqueColors.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
    }

    // Sizes
    if (updates.sizes) {
      const uniqueSizes = [...new Set(updates.sizes)];
      updateData.sizes = uniqueSizes.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
    }

    // Inventory
    if (updates.inventory) {
      const product = await ProductRepository.findById(productId);
      if (!product) throw new AppError("Product not found", 404);

      const colors =
        updateData.colors ?? product.colors.map((c) => c.toString());
      const sizes = updateData.sizes ?? product.sizes.map((s) => s.toString());

      updateData.inventory = validateInventory(
        colors,
        sizes,
        updates.inventory,
      ) as IInventory[];
    }

    // Finally, update
    const updated = await ProductRepository.updateById(productId, updateData);

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
    colorId: Types.ObjectId,
    sizeId: Types.ObjectId,
    qty: number,
    session?: any,
  ) {
    if (qty <= 0) {
      throw new AppError("Invalid quantity", 400);
    }

    const res = await ProductRepository.decrementStock(
      productId,
      colorId,
      sizeId,
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
    color: Types.ObjectId,
    size: Types.ObjectId,
    qty: number,
    session?: any,
  ) {
    await ProductRepository.restoreStock(productId, color, size, qty, session);
  },
};

export default ProductService;
