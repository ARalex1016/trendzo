import type { Document, Types, QueryOptions } from "mongoose";

// Models
import Category, { type ICategory } from "../Models/category.model.ts";

// Utils
import ApiFeatures, { type Meta } from "../Utils/apiFeatures/ApiFeatures.ts";

/**
 * Type-safe filter for categories.
 * Use Partial<ICategory> for basic equality filters.
 * For complex queries ($gt, $in, etc.) you can use Record<string, any>
 */
export type CategoryFilter = Record<string, any>;

export interface ICatalogListResult<T> {
  data: T[];
  meta: Meta | null;
}

const CategoryRepository = {
  /**
   * Find category by ID
   */
  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  },

  /**
   * Find a single category matching filter
   */
  async findOne(
    filter: CategoryFilter,
    projection: Record<string, unknown> | null = null,
    options: QueryOptions = {}
  ): Promise<ICategory | null> {
    return Category.findOne(filter, projection, options);
  },

  /**
   * Create a new category
   */
  async create(payload: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(payload);
    return category.save();
  },

  /**
   * Save existing category (after update)
   */
  async save(category: ICategory): Promise<ICategory> {
    return category.save();
  },

  /**
   * Delete a category
   */
  async delete(category: ICategory): Promise<void> {
    await category.deleteOne();
  },

  /**
   * List categories with filtering, sorting, field limiting, pagination
   */
  async list(
    queryParams: Record<string, unknown>
  ): Promise<ICatalogListResult<ICategory>> {
    const features = new ApiFeatures<ICategory>(
      Category.find(),
      queryParams as any
    )
      .filter()
      .sort()
      .limitFields();

    await features.paginate();

    const data = await features.query;
    return { data, meta: features.meta };
  },

  /**
   * Count categories matching filter
   */
  async count(filter: CategoryFilter = {}): Promise<number> {
    return Category.countDocuments(filter);
  },
};

export default CategoryRepository;
