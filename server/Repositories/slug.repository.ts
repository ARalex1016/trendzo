import type { Model } from "mongoose";

export const SlugRepository = {
  async findBySlug(model: Model<any>, field: string, slug: string) {
    return model.findOne({ [field]: slug }).lean();
  },

  async findBySlugs(model: Model<any>, field: string, slugs: string[]) {
    return model
      .find({ [field]: { $in: slugs } })
      .select(field)
      .lean();
  },
};
