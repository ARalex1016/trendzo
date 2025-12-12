// services/pricing.service.ts
import { Types } from "mongoose";

// Models
import Product, { type IProduct } from "./../Models/product.model.ts";

// Utils
import AppError from "../Utils/AppError.ts";

export interface CalculatedItem {
  productId: Types.ObjectId;
  productSnapshot: {
    name: string;
    slug?: string;
    images?: string[];
  };
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Determine unit price for a product item using variant/size price fallback order:
 *   size.price -> variant.basePrice -> product.basePrice
 */
export const calculateItemPrice = async (
  productId: Types.ObjectId,
  color: string,
  size: string
): Promise<number> => {
  const product = await Product.findById(productId).lean();

  if (!product) throw new AppError("Product not found");

  // Find color variant
  const variant = (product.variants || []).find((v: any) => v.color === color);
  if (!variant)
    throw new AppError(
      `Variant color "${color}" not found for product ${product._id}`
    );

  // find size
  const sizeObj = (variant.sizes || []).find((s: any) => s.size === size);
  if (!sizeObj)
    throw new AppError(`Size "${size}" not found in variant ${color}`);

  const price =
    sizeObj.price ?? variant.basePrice ?? (product as any).basePrice;
  if (price == null) throw new AppError("No price available for product");

  return price;
};
