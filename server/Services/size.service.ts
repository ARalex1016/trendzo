// Repository
import SizeRepository from "../Repositories/size.repository.ts";

// Types
import type { Types } from "mongoose";
import type { ISize } from "../Models/size.model.ts";

const SizeService = {
  async createSize(data: Partial<ISize>): Promise<ISize> {
    if (!data.name || !data.type) {
      throw new Error("Name and type are required");
    }

    // Check for unique name + type
    const existing = await SizeRepository.findOne({
      name: data.name,
      type: data.type,
    });

    if (existing)
      throw new Error("Size with this name and type already exists");

    return SizeRepository.create(data);
  },

  async getSizeById(sizeId: Types.ObjectId): Promise<ISize> {
    const size = await SizeRepository.findById(sizeId);
    if (!size) throw new Error("Size not found");
    return size;
  },

  async updateSize(
    sizeId: Types.ObjectId,
    updateData: Partial<ISize>,
  ): Promise<ISize> {
    const updated = await SizeRepository.update(sizeId, updateData);
    if (!updated) throw new Error("Size not found or update failed");
    return updated;
  },

  async deleteSize(sizeId: Types.ObjectId): Promise<ISize> {
    const deleted = await SizeRepository.delete(sizeId);
    if (!deleted) throw new Error("Size not found or delete failed");
    return deleted;
  },

  async listSizes(): Promise<ISize[]> {
    return SizeRepository.list();
  },
};

export default SizeService;
