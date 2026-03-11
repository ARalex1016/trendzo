import mongoose, { type Types } from "mongoose";
import AppError from "../Utils/AppError.ts";

export const validateInventory = (
  colors: (string | Types.ObjectId)[],
  sizes: (string | Types.ObjectId)[],
  inventory: any[],
) => {
  const colorSet = new Set(colors.map((c) => c.toString()));
  const sizeSet = new Set(sizes.map((s) => s.toString()));

  const seen = new Set<string>();

  return inventory.map((item) => {
    if (!mongoose.isValidObjectId(item.color)) {
      throw new AppError(`Invalid color id: ${item.color}`, 400);
    }

    if (!mongoose.isValidObjectId(item.size)) {
      throw new AppError(`Invalid size id: ${item.size}`, 400);
    }

    if (!colorSet.has(item.color)) {
      throw new AppError(
        `Color not listed in product colors: ${item.color}`,
        400,
      );
    }

    if (!sizeSet.has(item.size)) {
      throw new AppError(`Size not listed in product sizes: ${item.size}`, 400);
    }

    const key = `${item.color}-${item.size}`;

    if (seen.has(key)) {
      throw new AppError(`Duplicate inventory entry: ${key}`, 400);
    }

    seen.add(key);

    return {
      color: new mongoose.Types.ObjectId(item.color),
      size: new mongoose.Types.ObjectId(item.size),
      stock: item.stock ?? 0,
    };
  });
};
