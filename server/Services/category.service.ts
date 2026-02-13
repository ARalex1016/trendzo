import slugify from "slugify";
import type { Types } from "mongoose";

// Repository
import CategoryRepository from "../Repositories/category.repository.ts";

// Model
import type { ICategory } from "../Models/category.model.ts";

// Utils
import AppError from "../Utils/AppError.ts";

/**
 * Service layer: contains business logic and is independent of DB implementation.
 * It depends on CategoryRepository which encapsulates DB operations.
 */
const CategoryService = {
  async getAll(queryParams: Record<string, unknown>) {
    const result = await CategoryRepository.list(queryParams);
    return result;
  },

  async create(payload: {
    name: string;
    description?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    parentCategory?: string | null;
    createdBy: Types.ObjectId | string;
  }) {
    const name = payload.name?.trim();
    if (!name) throw new AppError("Category name is required.", 400);

    // check duplicate name
    const existing = await CategoryRepository.findOne({ name });
    if (existing)
      throw new AppError("Category with this name already exists.", 400);

    // slug
    const generatedSlug = payload.slug
      ? slugify(String(payload.slug), { lower: true, strict: true })
      : slugify(name, { lower: true, strict: true });

    const existingSlug = await CategoryRepository.findOne({
      slug: generatedSlug,
    });
    if (existingSlug)
      throw new AppError("Category with this slug already exists.", 400);

    // parentCategory validation
    let parentCategoryId: Types.ObjectId | null = null;
    if (payload.parentCategory) {
      const parent = await CategoryRepository.findById(payload.parentCategory);
      if (!parent) throw new AppError("Parent category not found.", 400);
      parentCategoryId = parent._id;
    }

    const newCategory = await CategoryRepository.create({
      name,
      description: payload.description?.trim(),
      slug: generatedSlug,
      metaTitle: payload.metaTitle?.trim(),
      metaDescription: payload.metaDescription?.trim(),
      parentCategory: parentCategoryId,
      createdBy: payload.createdBy as Types.ObjectId,
    } as Partial<ICategory>);

    return newCategory;
  },

  async update(
    target: ICategory,
    payload: Partial<
      ICategory & { slug?: string; parentCategory?: string | null }
    >
  ) {
    // name uniqueness
    if (payload.name && payload.name.trim() !== target.name) {
      const exists = await CategoryRepository.findOne({
        name: payload.name.trim(),
        _id: { $ne: target._id },
      } as any);
      if (exists)
        throw new AppError(
          "Another category with this name already exists.",
          400
        );
      target.name = payload.name.trim();
    }

    // slug handling
    if (payload.slug) {
      const slugified = slugify(String(payload.slug), {
        lower: true,
        strict: true,
      });
      const existing = await CategoryRepository.findOne({
        slug: slugified,
        _id: { $ne: target._id },
      } as any);
      if (existing)
        throw new AppError(
          "Another category with this slug already exists.",
          400
        );
      target.slug = slugified;
    } else if (payload.name) {
      target.slug = slugify(payload.name, { lower: true, strict: true });
    }

    // optional fields
    if (payload.description !== undefined)
      target.description = payload.description as string;
    if (payload.metaTitle !== undefined)
      target.metaTitle = payload.metaTitle as string;
    if (payload.metaDescription !== undefined)
      target.metaDescription = payload.metaDescription as string;
    if (payload.isActive !== undefined)
      target.isActive = Boolean(payload.isActive);
    if (payload.image !== undefined) target.image = payload.image as string;

    // handle parentCategory: allow setting to null to remove parent
    if (payload.parentCategory !== undefined) {
      if (
        payload.parentCategory === null ||
        payload.parentCategory === "null"
      ) {
        target.parentCategory = null;
      } else {
        const parentId = String(payload.parentCategory);
        if (String(parentId) === String(target._id)) {
          throw new AppError("Category cannot be its own parent.", 400);
        }

        const parent = await CategoryRepository.findById(parentId);
        if (!parent) throw new AppError("Parent category not found.", 400);

        // prevent cycles: ensure parent is not a descendant of target
        let cursor: ICategory | null = parent;
        while (cursor) {
          if (!cursor.parentCategory) break;
          if (String(cursor.parentCategory) === String(target._id)) {
            throw new AppError(
              "Parent category would create a cycle with this category.",
              400
            );
          }
          // fetch next ancestor
          // eslint-disable-next-line no-await-in-loop
          cursor = (await CategoryRepository.findById(
            String(cursor.parentCategory)
          )) as ICategory | null;
          if (!cursor) break;
        }

        target.parentCategory = parent._id;
      }
    }

    const updated = await CategoryRepository.save(target);
    return updated;
  },

  async toggleStatus(target: ICategory) {
    target.isActive = !target.isActive;
    return CategoryRepository.save(target);
  },

  async remove(target: ICategory) {
    return CategoryRepository.delete(target);
  },

  async getById(id: string) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  },
};

export default CategoryService;
