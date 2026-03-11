export const PricingService = {
  calculateItemPrice(baseSellingPrice: number, discount?: number): number {
    if (!baseSellingPrice) throw new Error("Invalid product price");

    if (!discount) return baseSellingPrice;

    return baseSellingPrice - (baseSellingPrice * discount) / 100;
  },
};
