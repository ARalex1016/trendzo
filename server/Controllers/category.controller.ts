import slugify from "slugify";
import type { Request, Response } from "express";

// Models
import Category, { type ICategory } from "./../Models/category.model.ts";

// Utils
import ApiFeatures from "../Utils/apiFeatures/ApiFeatures.ts";

// Public
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const features = new ApiFeatures(Category.find(), req.query)
      .filter()
      .sort()
      .limitFields();

    await features.paginate();

    const categories = await features.query;

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "",
      meta: features.meta,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Admin
export const createCategory = async (req: Request, res: Response) => {
  const {
    name,
    description,
    slug,
    metaTitle,
    metaDescription,
    parentCategory,
  } = req.body;

  try {
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Category name is required.",
      });
    }

    // Check for duplicate name
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        status: "fail",
        message: "Category with this name already exists.",
      });
    }

    // Generate slug if not provided
    const categorySlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const existingSlug = await Category.findOne({ slug: categorySlug });
    if (existingSlug) {
      return res.status(400).json({
        status: "fail",
        message: "Category with this slug already exists.",
      });
    }

    // If parentCategory is provided, verify it exists
    let parentCategoryId = null;
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({
          status: "fail",
          message: "Parent category not found.",
        });
      }
      parentCategoryId = parent._id;
    }

    const newCategory: ICategory = new Category({
      name: name.trim(),
      description: description?.trim(),
      slug: categorySlug,
      metaTitle: metaTitle?.trim(),
      metaDescription: metaDescription?.trim(),
      parentCategory: parentCategoryId,
      createdBy: req.user!._id,
    });

    await newCategory.save();

    // Success logic here
    res.status(201).json({
      status: "success",
      message: "Category created successfully.",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const targetCategory = req.targetCategory!;

  const {
    name,
    description,
    slug,
    metaTitle,
    metaDescription,
    parentCategory,
    isActive,
    image,
  } = req.body;

  try {
    // Check if name is being updated and is unique
    if (name && name.trim() !== targetCategory.name) {
      const existingName = await Category.findOne({
        name: name.trim(),
        _id: { $ne: targetCategory._id },
      });

      if (existingName) {
        return res.status(400).json({
          status: "fail",
          message: "Another category with this name already exists.",
        });
      }
      targetCategory.name = name.trim();
    }

    // Update slug (generate if not provided)
    if (slug) {
      const slugified = slugify(slug, { lower: true, strict: true });
      const existingSlug = await Category.findOne({
        slug: slugified,
        _id: { $ne: targetCategory._id },
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: "Another category with this slug already exists.",
        });
      }
      targetCategory.slug = slugified;
    } else if (name) {
      // regenerate slug from updated name
      targetCategory.slug = slugify(name, { lower: true, strict: true });
    }

    // Update description, meta fields, image, isActive
    if (description !== undefined) targetCategory.description = description;
    if (metaTitle !== undefined) targetCategory.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      targetCategory.metaDescription = metaDescription;
    if (isActive !== undefined) targetCategory.isActive = isActive;
    if (image !== undefined) targetCategory.image = image;

    // Handle parent category
    if (parentCategory) {
      if (parentCategory === targetCategory._id) {
        return res.status(400).json({
          status: "fail",
          message: "Category cannot be its own parent.",
        });
      }
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res
          .status(400)
          .json({ status: "fail", message: "Parent category not found." });
      }
      targetCategory.parentCategory = parent._id;
    } else if (parentCategory === null) {
      targetCategory.parentCategory = null; // remove parent category
    }

    await targetCategory.save();

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Category updated successfully.",
      data: targetCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const toggleCategoryStatus = async (req: Request, res: Response) => {
  try {
    const targetCategory = req.targetCategory!;

    targetCategory.isActive = !targetCategory.isActive;
    await targetCategory.save();

    // Success logic here
    res.status(200).json({
      status: "success",
      message: `Category has been ${
        targetCategory.isActive ? "enabled" : "disabled"
      } successfully.`,
      data: targetCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const targetCategory = req.targetCategory!;

  try {
    await targetCategory.deleteOne();

    // Success logic here
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
