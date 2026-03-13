export interface InventoryInput {
  color: string; // Color ObjectId
  size: string; // Size ObjectId
  stock: number;
}

export interface ProductSpecificationsInput {
  weight?: number;
  material?: string;
  countryOfOrigin?: string;
  warranty?: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;

  images: string[];
  thumbnail: string;

  baseCostPrice: number;
  baseSellingPrice: number;

  discount?: number;

  specifications?: ProductSpecificationsInput;

  colors: string[]; // Color ObjectIds
  sizes: string[]; // Size ObjectIds

  inventory: InventoryInput[];

  categories: string[];

  tags?: string[];

  featured?: boolean;

  isActive?: boolean;

  createdBy?: string;
}
