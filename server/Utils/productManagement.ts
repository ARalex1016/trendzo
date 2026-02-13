import AppError from "../Utils/AppError.ts";

import type { IVariant } from "../Models/product.model.ts";
import type { VariantInput } from "../types/product.types.ts";

export const normalizeVariants = (
  variants: VariantInput[],
  baseCostPrice: number,
  baseSellingPrice: number
): IVariant[] => {
  return variants.map((variant) => {
    if (!variant.color) {
      throw new AppError("Variant color is required", 400);
    }

    const sizes = variant.sizes.map((sz) => {
      const costPrice = sz.costPrice ?? baseCostPrice;
      const sellingPrice = sz.sellingPrice ?? baseSellingPrice;

      if (costPrice > sellingPrice) {
        throw new AppError(
          `Cost price cannot exceed selling price (${variant.color} - ${sz.size})`,
          400
        );
      }

      return {
        size: sz.size.trim(),
        stock: sz.stock ?? 0,
        costPrice,
        sellingPrice,
      };
    });

    return {
      color: variant.color.trim(),
      images: variant.images ?? [],
      sizes,
    };
  });
};
