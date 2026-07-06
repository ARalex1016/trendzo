// Types
import type { IColor } from "@/types/color.type";
import type { ISize } from "@/types/size.types";

// Shared
import type {
  IImage,
  IInventory,
  IProductSpecifications,
} from "../product_shared";

export interface IProductDetailAdmin {
  _id: string;

  name: string;
  slug: string;

  description: string;

  specifications?: IProductSpecifications;

  // Base images (same for all variants)
  images: IImage[];
  thumbnail: IImage;

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
