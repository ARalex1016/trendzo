import { Types } from "mongoose";
import Product from "../Models/product.model.ts";
import AppError from "../Utils/AppError.ts";

export const PricingService = {
  /**
   * Determine the unit price of a product variant/size.
   * @param variantPrice Price of the selected size (if exists)
   * @param variantBasePrice Base price of the variant (if exists)
   * @param productBasePrice Base price of the product
   */
  calculateItemPrice(
    variantPrice?: number,
    variantBasePrice?: number,
    productBasePrice?: number
  ): number {
    const price = variantPrice ?? variantBasePrice ?? productBasePrice;
    if (price == null) throw new Error("No price available for product");
    return price;
  },
};
