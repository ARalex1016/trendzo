import { Types } from "mongoose";

// Repositories
import ColorRepository from "../Repositories/color.repository.ts";

// Types
import type { IColor } from "../Models/color.model.ts";

export const ColorService = {
  async createColor(data: Partial<IColor>) {
    return ColorRepository.create(data);
  },

  async getAllColors() {
    return ColorRepository.findAll({ isActive: true });
  },

  async getColorById(colorId: Types.ObjectId) {
    return ColorRepository.findById(colorId);
  },

  async updateColor(colorId: Types.ObjectId, data: Partial<IColor>) {
    return ColorRepository.update(colorId, data);
  },

  async deleteColor(colorId: Types.ObjectId) {
    return ColorRepository.delete(colorId);
  },
};

export default ColorService;
