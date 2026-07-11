import type { Model } from "mongoose";

import AppError from "../Utils/AppError.ts";

import { generateUniqueSlugs, isSlugAvailable } from "../Utils/slug.ts";

export const SlugService = {
  async suggestSlugs<T extends Record<string, unknown>>(
    model: Model<T>,
    field: keyof T & string,
    value: string,
    limit = 5,
  ): Promise<string[]> {
    if (!value.trim()) {
      throw new AppError("Value is required to generate slug", 400);
    }

    return generateUniqueSlugs(model, field, value, limit);
  },

  async checkAvailability<T extends Record<string, unknown>>(
    model: Model<T>,
    field: keyof T & string,
    slug: string,
  ): Promise<boolean> {
    if (!slug.trim()) {
      throw new AppError("Slug value is required", 400);
    }

    return isSlugAvailable(model, field, slug);
  },
};
