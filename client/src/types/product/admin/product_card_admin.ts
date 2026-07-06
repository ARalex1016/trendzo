// Shared
import type { IImage } from "../product_shared";

export interface IProductCardAdmin {
  _id: string;

  name: string;
  slug: string;

  // Base images (same for all variants)
  thumbnail: IImage;

  // Base price
  baseCostPrice: number;
  baseSellingPrice: number;
  discount?: number;

  // Inventory
  stock: number;
  variants: number;

  categories: string[]; // Category ObjectIds
  tags: string[];

  featured: boolean;
  isActive: boolean;

  createdBy: string; // User ObjectId

  createdAt: string;
  updatedAt: string;
}
