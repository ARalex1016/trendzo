import type { IVariant } from "./../Models/product.model.ts";

interface NormalizedVariant extends IVariant {}

export const normalizeVariants = (
  variants: IVariant[],
  productBasePrice: number
): NormalizedVariant[] => {
  return variants.map((variant) => {
    const normalizedSizes = variant.sizes.map((sz) => ({
      size: sz.size.trim(),
      stock: sz.stock ?? 0,
      price: sz.price ?? variant.basePrice ?? productBasePrice,
    }));

    return {
      color: variant.color.trim(),
      images: variant.images || [],
      basePrice: variant.basePrice ?? productBasePrice,
      sizes: normalizedSizes,
    };
  });
};
