// Shared
import type { IImage } from "../product_shared";

export interface IProductCard {
  _id: string;

  name: string;
  slug: string;

  // Base images (same for all variants)
  thumbnail: IImage;

  // Base price
  baseSellingPrice: number;
  discount?: number;

  categories: string[]; // Category ObjectIds
  tags: string[];

  featured: boolean;
  isActive: boolean;

  createdAt: string;
}
