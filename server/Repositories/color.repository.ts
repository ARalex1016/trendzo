// Models
import Color from "../Models/color.model.ts";

// Types
import type { QueryFilter, Types } from "mongoose";
import type { IColor } from "../Models/color.model.ts";

const ColorRepository = {
  async create(colorData: Partial<IColor>): Promise<IColor> {
    const color = new Color(colorData);
    return color.save();
  },

  async findAll(filter: QueryFilter<IColor> = {}): Promise<IColor[]> {
    return Color.find(filter).sort({ createdAt: -1 });
  },

  async findById(colorId: string | Types.ObjectId): Promise<IColor | null> {
    return Color.findById(colorId);
  },

  async findBySlug(slug: string): Promise<IColor | null> {
    return Color.findOne({ slug });
  },

  async update(
    colorId: string | Types.ObjectId,
    updateData: Partial<IColor>,
  ): Promise<IColor | null> {
    return Color.findByIdAndUpdate(colorId, updateData, {
      new: true,
      runValidators: true,
    });
  },

  async delete(colorId: string | Types.ObjectId): Promise<IColor | null> {
    return Color.findByIdAndDelete(colorId);
  },
};

export default ColorRepository;
