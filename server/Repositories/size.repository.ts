import { Types } from "mongoose";

// Models
import Size from "../Models/size.model.ts";

// Types
import type { QueryFilter } from "mongoose";
import type { ISize } from "../Models/size.model.ts";

const SizeRepository = {
  async create(sizeData: Partial<ISize>): Promise<ISize> {
    const size = new Size(sizeData);
    return size.save();
  },

  async findById(sizeId: string | Types.ObjectId): Promise<ISize | null> {
    return Size.findById(sizeId);
  },

  async findOne(filter: QueryFilter<ISize>): Promise<ISize | null> {
    return Size.findOne(filter);
  },

  async update(
    sizeId: string | Types.ObjectId,
    updateData: Partial<ISize>,
  ): Promise<ISize | null> {
    return Size.findByIdAndUpdate(sizeId, updateData, {
      new: true,
      runValidators: true,
    });
  },

  async delete(sizeId: string | Types.ObjectId): Promise<ISize | null> {
    return Size.findByIdAndDelete(sizeId);
  },

  async list(filter: QueryFilter<ISize> = {}): Promise<ISize[]> {
    return Size.find(filter).sort({ createdAt: -1 });
  },
};

export default SizeRepository;
