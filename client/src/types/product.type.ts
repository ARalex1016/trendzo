// Types
import type { IColor } from "./color.type";
import type { ISize } from "./size.types";

export interface IInventory {
  color: string; // ObjectId of Color
  size: string; // ObjectId of Size
  stock: number;
}

export interface IProductSpecifications {
  weight?: number;
  material?: string;
  countryOfOrigin?: string;
  warranty?: string;
}

export interface IProduct {
  _id: string;

  name: string;
  slug: string;

  description: string;

  specifications?: IProductSpecifications;

  // Base images (same for all variants)
  images: string[];
  thumbnail: string;

  // Base price
  baseCostPrice: number;
  baseSellingPrice: number;
  discount?: number;

  // Available options
  colors: IColor[]; // Color ObjectIds
  sizes: ISize[]; // Size ObjectIds

  // Inventory combinations
  inventory: IInventory[];

  categories: string[]; // Category ObjectIds
  tags: string[];

  featured: boolean;
  isActive: boolean;

  createdBy: string; // User ObjectId

  createdAt: string;
  updatedAt: string;
}
