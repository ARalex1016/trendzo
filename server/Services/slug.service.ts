import type { Model } from "mongoose";

// Repositories
import { SlugRepository } from "../Repositories/slug.repository.ts";

// Utils
import { generateUniqueSlugs, isSlugAvailable } from "../Utils/slugManager.ts";

// Errors
import AppError from "../Utils/AppError.ts";

export const SlugService = {
  async suggestSlugs(
    model: Model<any>,
    field: string,
    value: string,
    limit = 5
  ) {
    if (!value?.trim()) {
      throw new AppError("Value is required to generate slug", 400);
    }

    return generateUniqueSlugs(model, field, value, limit);
  },

  async checkAvailability(model: Model<any>, field: string, slug: string) {
    if (!slug?.trim()) {
      throw new AppError("Slug value is required", 400);
    }

    return isSlugAvailable(model, field, slug);
  },
};
